import {inject, injectable} from "tsyringe";

import {ContactEntity} from "@entities/Contact/ContactEntity";
import {FacilityEntity} from "@entities/Facility/FacilityEntity";

import {FACILITY_NOTIFICATION_TYPES} from "@constants/FacilityConstant";
import {REPOSITORIES} from "@constants/FileConstant";

import {ORDER_BY} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";
import {AddNotificationDto} from "@application/Notification/DTOs/AddNotificationDTO";

import {FacilityFilter} from "@repositories/Shared/ORM/FacilityFilter";

import {facilityUnitsService, notificationService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddFacilityDTO} from "./DTOs/AddFacilityDTO";
import type {GetFacilityDTO} from "./DTOs/GetFacilityDTO";
import type {RemoveFacilityDTO} from "./DTOs/RemoveFacilityDTO";
import type {UpdateFacilityDTO} from "./DTOs/UpdateFacilityDTO";
import type {IFacilityRepository} from "@entities/Facility/IFacilityRepository";
import type {IFacilityAdminRepository} from "@entities/FacilityAdmin/IFacilityAdminRepository";
import type {Facility} from "@infrastructure/Database/Models/Facility";
import type {TSearchFilters} from "@src/typings/ORM";

type TSearchFacility = TSearchFilters<Facility> & {facilityId?: string | string[]};

@injectable()
export class FacilityService extends BaseService<Facility, FacilityEntity> {
    constructor(
        @inject("IFacilityRepository") private facilityRepository: IFacilityRepository,
        @inject("IFacilityAdminRepository") private facilityAdminRepository: IFacilityAdminRepository
    ) {
        super(facilityRepository);
    }

    async addFacility(addFacilityDTO: AddFacilityDTO) {
        try {
            const searchFilters = FacilityFilter.setFilter({facilityName: addFacilityDTO.facilityName});
            const isFacility = await this.facilityRepository.fetch(searchFilters);
            if (isFacility) {
                return HttpResponse.conflict();
            }

            const facilityEntity = FacilityEntity.create(addFacilityDTO);
            facilityEntity.facilityId = SharedUtils.shortUuid();

            await this.facilityRepository.create(facilityEntity);

            await notificationService.subAddNotification(
                AddNotificationDto.create({
                    repository: REPOSITORIES.FACILITY,
                    type: FACILITY_NOTIFICATION_TYPES.FACILITY_CHECKLIST_INCOMPLETE,
                    facilityId: facilityEntity.facilityId as string
                })
            );

            return HttpResponse.created(FacilityEntity.publicFields(facilityEntity));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subGetFacilities(getFacilityDTO: GetFacilityDTO) {
        const searchFilters = getFacilityDTO;
        const facilities = await this.facilityRepository.fetchBySearchQuery(searchFilters as never);
        if (!facilities) {
            return false;
        }

        return this.getGroupedFacilities(facilities);
    }

    async getFacilities(getFacilityDTO: GetFacilityDTO) {
        try {
            const facilities = await this.subGetFacilities(getFacilityDTO);
            if (!facilities) {
                return HttpResponse.notFound();
            }
            const faclityCounts = await this.facilityAdminRepository.fetchFacilityCounts();
            if (facilities.length) {
                for (const facility of facilities) {
                    const unitsCount = await facilityUnitsService.count({facilityId: facility?.facilityId});
                    facility.staffCount =
                        faclityCounts.find((f) => f.facilityId === facility.facilityId)?.staffCount ?? 0;
                    facility.unitsCount = unitsCount;
                }
            }

            return HttpResponse.ok(facilities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    private getGroupedFacilities(facilities: Facility[]) {
        const uniqueFacilityIds = SharedUtils.getUniqueArrayFromObject(facilities, "facilityId");

        return uniqueFacilityIds.map((facilityId) => {
            const filteredFacilities = facilities.filter((facility) => facility.facilityId === facilityId);
            const contactEntities = filteredFacilities.map((facility) => ContactEntity.publicFields(facility));
            const filteredContactEntities = contactEntities.filter((contactEntity) => contactEntity.contactId);

            const facilityEntity = FacilityEntity.publicFields(filteredFacilities[0]);
            facilityEntity.contact = filteredContactEntities;

            return facilityEntity;
        });
    }

    async updateFacility(updateFacilityDTO: UpdateFacilityDTO) {
        try {
            const searchById: TSearchFacility = {facilityId: updateFacilityDTO.facilityId};
            const facility = await this.facilityRepository.fetch(searchById);
            if (!facility) {
                return HttpResponse.notFound();
            }

            const facilityEntity = FacilityEntity.create({...facility, ...updateFacilityDTO});
            await this.facilityRepository.update(searchById, facilityEntity);

            const updatedFacility = await this.subGetFacilities({facilityId: facilityEntity.facilityId});
            if (!updatedFacility) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok(updatedFacility[0] as FacilityEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async removeFacility(removeFacilityDTO: RemoveFacilityDTO) {
        try {
            const searchById: TSearchFacility = {facilityId: removeFacilityDTO.facilityId};
            const facility = await this.facilityRepository.fetch(searchById);
            if (!facility) {
                return HttpResponse.notFound();
            }

            await this.facilityRepository.remove(searchById);

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getFacilitiesById(searchBy: {
        id?: number;
        facilityId?: string | string[];
        externalFacilityId?: string | string[];
    }) {
        const searchFilter = FacilityFilter.setFilter(searchBy);
        const facilities =
            Object.keys(searchFilter).length > 0
                ? await this.facilityRepository.fetchAll(searchFilter, {id: ORDER_BY.ASC})
                : false;

        if (!facilities) {
            return false;
        }

        return facilities.map((facility) => FacilityEntity.create(facility));
    }
}
