import async from "async";
import {inject, injectable} from "tsyringe";

import {FacilityUnitEntity} from "@entities/FacilityUnit/FacilityUnitEntity";

import {MedicationTransformer} from "@domain/Transformers/MedicationTransformer";

import {ORDER_BY} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {FacilityUnitFilter} from "@repositories/Shared/ORM/FacilityUnitsFilter";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {cartService, facilityService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddFacilityUnitDto} from "./Dtos/AddFacilityUnitDto";
import type {GetFacilityUnitDto} from "./Dtos/GetFacilityUnitDto";
import type {UpdateLocationDto} from "./Dtos/UpdateLocationDto";
import type {IMedicationTransformer} from "@domain/Transformers/MedicationTransformer";
import type {IFacilityUnitRepository} from "@entities/FacilityUnit/IFacilityUnitRepository";
import type {FacilityUnit} from "@infrastructure/Database/Models/FacilityUnit";
import type {PaginationDto} from "@infraUtils/PaginationDto";

@injectable()
export class FacilityUnitService extends BaseService<FacilityUnit, FacilityUnitEntity> {
    constructor(@inject("IFacilityUnitRepository") private faciltyUnitsRepository: IFacilityUnitRepository) {
        super(faciltyUnitsRepository);
    }

    async getUnits(getFacilityUnitDto: GetFacilityUnitDto, paginationDto: PaginationDto) {
        try {
            const pagination = PaginationOptions.create(paginationDto);

            const filters = FacilityUnitFilter.setFilter(getFacilityUnitDto);
            const facilityUnits = await this.fetchPaginated(filters, {unit: ORDER_BY.ASC}, pagination);
            if (!facilityUnits) {
                return HttpResponse.notFound();
            }

            const facilityUnitsEntities = facilityUnits.map((fu) => {
                return FacilityUnitEntity.create(fu);
            });

            const facilityUnitCount = await this.count(filters);

            const paginatedUnits = PaginationData.getPaginatedData(
                pagination,
                facilityUnitCount,
                facilityUnitsEntities
            );

            return HttpResponse.ok(paginatedUnits);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async updateLocations(updateLocationDto: UpdateLocationDto) {
        try {
            const {units} = updateLocationDto;
            await async.eachSeries(units, async (unit) => {
                const isUnit = await this.fetch({facilityUnitId: unit.facilityUnitId});
                if (!isUnit) {
                    return;
                }
                const unitEntity = FacilityUnitEntity.create({...unit, cartId: null});
                await this.update({facilityUnitId: unit.facilityUnitId}, unitEntity);
                const unitCount = await this.count({cartId: isUnit.cartId});
                if (unitCount === 0) {
                    await cartService.remove({cartId: isUnit.cartId});
                }
            });

            return HttpResponse.ok({
                message: "Facility Units updated succesfully"
            });
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async transformMedpassData(ExternalMedPassData: IMedicationTransformer[]) {
        const medPassRows = ExternalMedPassData.map((data) => MedicationTransformer.create(data));
        const transformedRows = SharedUtils.convertStringToPrimitives(medPassRows, {});

        if (!transformedRows) {
            return;
        }

        const facilitiesInFile = [...new Set(transformedRows.map((row: IMedicationTransformer) => row.facilityId))];
        const facilities = await facilityService.getFacilitiesById({externalFacilityId: facilitiesInFile});

        if (!facilities) {
            return [];
        }

        const unitsWithCount: unknown[] = [];

        facilities.forEach((facility) => {
            const setUnits = new Set<string>(
                transformedRows
                    .filter((row) => row.facilityId === facility.externalFacilityId && !!row.unit)
                    .map((row: IMedicationTransformer) => {
                        return row.unit ?? "";
                    })
            );
            const unitsList = [...setUnits];
            const TempUnitsWithCount = unitsList.map((unit) => {
                const ItemsInUnit = transformedRows.filter(
                    (row) => row.unit === unit && row.facilityId === facility.externalFacilityId
                );
                const patientSet = new Set(ItemsInUnit.map((row) => row.jmsId));
                const ndcSet = new Set(ItemsInUnit.map((row) => row.ndc));

                return {
                    unit: unit,
                    facilityId: facility.facilityId,
                    patientCount: patientSet.size,
                    drugCount: ndcSet.size,
                    quantity: ItemsInUnit.reduce((accumulator, currentValue) => {
                        if (ndcSet.has(currentValue.ndc)) {
                            return accumulator + Number(currentValue.dosage);
                        }

                        return accumulator;
                    }, 0)
                };
            });

            unitsWithCount.push(...TempUnitsWithCount);
        });

        return unitsWithCount;
    }

    async subAddUnits(addUnitDto: AddFacilityUnitDto) {
        const isUnit = await this.fetch({
            unit: addUnitDto.unit as string
        });

        const facilityUnitEntity = FacilityUnitEntity.create(addUnitDto);
        facilityUnitEntity.facilityUnitId = isUnit ? isUnit.facilityUnitId : SharedUtils.shortUuid();
        await this.faciltyUnitsRepository.upsert(facilityUnitEntity, {
            unit: addUnitDto.unit as string
        });

        return facilityUnitEntity;
    }

    async getUnassignedUnits(getFacilityUnitDto: GetFacilityUnitDto) {
        try {
            const searchFilter = FacilityUnitFilter.setFilter({
                cartId: null,
                isCart: 1,
                facilityId: getFacilityUnitDto.facilityId as string
            });

            const facilityUnits = await this.fetchAll(searchFilter, {unit: ORDER_BY.ASC});
            if (!facilityUnits) {
                return HttpResponse.notFound();
            }
            const unitsNameList = facilityUnits.map((unit) => ({unit: unit.unit, facilityUnitId: unit.facilityUnitId}));

            return HttpResponse.ok(unitsNameList);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
