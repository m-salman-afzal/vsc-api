import async from "async";
import {inject, injectable} from "tsyringe";

import {FacilityContactEntity} from "@entities/FacilityContact/FacilityContactEntity";

import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {FacilityContactFilter} from "@repositories/Shared/ORM/FacilityContactFilter";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddFacilityContactDto} from "./Dtos/AddFacilityContactDto";
import type {GetFacilityContactDto} from "./Dtos/GetFacilityContactDto";
import type {RemoveFacilityContactDto} from "./Dtos/RemoveFacilityContactDto";
import type {UpdateFacilityContactDto} from "./Dtos/UpdateFacilityContactDto";
import type {IFacilityContactRepository} from "@entities/FacilityContact/IFacilityContactRepository";
import type {FacilityContact} from "@infrastructure/Database/Models/FacilityContact";

@injectable()
export class FacilityContactService {
    constructor(@inject("IFacilityContactRepository") private facilityContactRepository: IFacilityContactRepository) {}
    async subRestoreFacilityContact(searchBy: {externalFacilityId?: string; facilityId?: string; contactId?: string}) {
        const searchFilters = FacilityContactFilter.setFilter(searchBy);
        const facilityContact = await this.facilityContactRepository.restore(searchFilters);
        if (!facilityContact) {
            return false;
        }

        return facilityContact;
    }

    private async toBeRestored(
        deletedFacilityContacts: FacilityContact[],
        updateFacilityContactDto: UpdateFacilityContactDto
    ) {
        const facilityContactsToBeRestored = deletedFacilityContacts.filter(
            (facilityContact) =>
                facilityContact.deletedAt && updateFacilityContactDto.facilityId?.includes(facilityContact.facilityId)
        );
        await async.eachSeries(facilityContactsToBeRestored, async (facilityContact) => {
            try {
                await this.subRestoreFacilityContact({
                    facilityId: facilityContact.facilityId,
                    contactId: updateFacilityContactDto.contactId as string
                });
            } catch (error) {
                ErrorLog(error);
            }
        });

        return facilityContactsToBeRestored;
    }

    private async toBeRemoved(facilityIds: string[], updateFacilityContactDto: UpdateFacilityContactDto) {
        const facilityIdsToBeRemoved = facilityIds.filter(
            (facilityId) => !updateFacilityContactDto.facilityId?.includes(facilityId)
        );
        await async.eachSeries(facilityIdsToBeRemoved, async (facilityId) => {
            try {
                await this.subRemoveFacilityContact({
                    facilityId: facilityId,
                    contactId: updateFacilityContactDto.contactId as string
                });
            } catch (error) {
                ErrorLog(error);
            }
        });
    }

    private async toBeAdded(
        facilityIds: string[],
        updateFacilityContactDto: UpdateFacilityContactDto,
        restoredFacilityContacts: FacilityContact[]
    ) {
        const facilityIdsToBeAdded = (updateFacilityContactDto.facilityId as string[]).filter(
            (facilityId) =>
                !facilityIds.includes(facilityId) &&
                !restoredFacilityContacts?.find((fa) => fa.facilityId === facilityId)
        );
        await async.eachSeries(facilityIdsToBeAdded, async (facilityId) => {
            try {
                await this.subAddFacilityContact({
                    facilityId: facilityId,
                    contactId: updateFacilityContactDto.contactId as string
                });
            } catch (error) {
                ErrorLog(error);
            }
        });
    }

    async subAddFacilityContact(addFacilityContactDto: AddFacilityContactDto) {
        const searchFilters = FacilityContactFilter.setFilter({
            facilityId: addFacilityContactDto.facilityId as string,
            contactId: addFacilityContactDto.contactId as string
        });
        const isFacilityContact = await this.facilityContactRepository.fetchAll(searchFilters, {});

        if (isFacilityContact) {
            return false;
        }

        const facilityContactEntity = FacilityContactEntity.create(addFacilityContactDto);
        facilityContactEntity.facilityContactId = SharedUtils.shortUuid();
        await this.facilityContactRepository.create(facilityContactEntity);

        return facilityContactEntity;
    }

    async addFacilityContact(addFacilityContactDto: AddFacilityContactDto) {
        try {
            const isFacilityContact = await this.subAddFacilityContact(addFacilityContactDto);
            if (isFacilityContact) {
                return HttpResponse.conflict();
            }

            return HttpResponse.created(FacilityContactEntity.create(isFacilityContact));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subGetFacilityContactsWithDeleted(searchBy: {facilityId?: string; contactId?: string}) {
        const searchFilters = FacilityContactFilter.setFilter(searchBy);
        const facilityContacts = await this.facilityContactRepository.fetchAllWithDeleted(searchFilters);
        if (!facilityContacts) {
            return false;
        }

        return facilityContacts;
    }

    async subGetFacilityContacts(getFacilityContactDto: GetFacilityContactDto) {
        const searchFilters = FacilityContactFilter.setFilter(getFacilityContactDto);
        const isFacilityContact = await this.facilityContactRepository.fetchAll(searchFilters, {});

        if (!isFacilityContact) {
            return false;
        }

        return isFacilityContact;
    }

    async getFacilityContacts(getFacilityContactDto: GetFacilityContactDto) {
        try {
            const facilityContacts = await this.subGetFacilityContacts(getFacilityContactDto);
            if (!facilityContacts) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok(
                facilityContacts.map((facilityContact) => FacilityContactEntity.create(facilityContact))
            );
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subUpdateFacilityContacts(updateFacilityContactDto: UpdateFacilityContactDto) {
        const results = await this.subGetFacilityContactsWithDeleted({
            contactId: updateFacilityContactDto.contactId as string
        });

        const isDeletedFacilityContacts = results ? results : [];

        const restoredFacilityContacts = await this.toBeRestored(isDeletedFacilityContacts, updateFacilityContactDto);

        const isFacilityContacts = isDeletedFacilityContacts.filter((facilityContacts) => !facilityContacts.deletedAt);
        const facilityIds = isFacilityContacts.map((facilityContact) => {
            return facilityContact.facilityId;
        });

        !updateFacilityContactDto.isAdd && (await this.toBeRemoved(facilityIds, updateFacilityContactDto));

        await this.toBeAdded(facilityIds, updateFacilityContactDto, restoredFacilityContacts);

        return true;
    }

    async updateFacilityContact(updateFacilityContactDto: UpdateFacilityContactDto) {
        try {
            const isFacilityContactUpdated = await this.subUpdateFacilityContacts(updateFacilityContactDto);
            if (!isFacilityContactUpdated) {
                return HttpResponse.notFound();
            }

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subRemoveFacilityContact(removeFacilityContactDto: RemoveFacilityContactDto) {
        const searchFilters = FacilityContactFilter.setFilter(removeFacilityContactDto);

        const isFacilityContact = await this.facilityContactRepository.fetch(searchFilters);
        if (!isFacilityContact) {
            return false;
        }

        return await this.facilityContactRepository.remove(searchFilters);
    }

    async removeFacilityContact(removeFacilityContactDto: RemoveFacilityContactDto) {
        try {
            const isFacilityContactRemoved = await this.subRemoveFacilityContact(removeFacilityContactDto);
            if (!isFacilityContactRemoved) {
                return HttpResponse.notFound();
            }

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
