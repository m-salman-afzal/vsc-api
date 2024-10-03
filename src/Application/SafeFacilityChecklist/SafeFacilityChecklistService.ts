import async from "async";
import {inject, injectable} from "tsyringe";

import {SafeFacilityChecklistEntity} from "@entities/SafeFacilityChecklist/SafeFacilityChecklistEntity";

import {ORDER_BY} from "@appUtils/Constants";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {SafeFacilityChecklistFilter} from "@repositories/Shared/ORM/SafeFacilityCheclistFilter";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddSafeFacilityChecklistDto} from "./Dtos/AddSafeFacilityChecklistDto";
import type {GetSafeFacilityChecklistDto} from "./Dtos/GetSafeFacilityChecklistDto";
import type {RemoveSafeFacilityChecklistDto} from "./Dtos/RemoveSafeFacilityChecklistDto";
import type {UpdateSafeFacilityChecklistDto} from "./Dtos/UpdateSafeFacilityChecklistDto";
import type {ISafeFacilityChecklistRepository} from "@entities/SafeFacilityChecklist/ISafeFacilityChecklistRepository";
import type {SafeFacilityChecklist} from "@infrastructure/Database/Models/SafeFacilityChecklist";

@injectable()
export class SafeFacilityChecklistService extends BaseService<SafeFacilityChecklist, SafeFacilityChecklistEntity> {
    constructor(
        @inject("ISafeFacilityChecklistRepository")
        private safeFacilityChecklistRepository: ISafeFacilityChecklistRepository
    ) {
        super(safeFacilityChecklistRepository);
    }

    async fetchAllSafeReportCheckList(searchFilter) {
        return this.safeFacilityChecklistRepository.fetchAllSafeReportCheckList(searchFilter);
    }

    async subAddSafeFacilityChecklist(addSafeFacilityChecklistDto: AddSafeFacilityChecklistDto) {
        const searchFilters = SafeFacilityChecklistFilter.setFilter(addSafeFacilityChecklistDto);
        const isSafeFacilityChecklist = await this.fetch(searchFilters);
        if (isSafeFacilityChecklist) {
            return false;
        }

        const safeFacilityChecklistEntity = SafeFacilityChecklistEntity.create(addSafeFacilityChecklistDto);
        safeFacilityChecklistEntity.safeFacilityChecklistId = SharedUtils.shortUuid();
        await this.create(safeFacilityChecklistEntity);

        return safeFacilityChecklistEntity;
    }

    async subGetSafeFacilityChecklist(getSafeFacilityChecklistDto: GetSafeFacilityChecklistDto) {
        const searchFilters = SafeFacilityChecklistFilter.setFilter(getSafeFacilityChecklistDto);
        const isSafeFacilityChecklist = await this.fetchAll(searchFilters, {
            id: ORDER_BY.ASC
        });
        if (!isSafeFacilityChecklist) {
            return false;
        }

        return SafeFacilityChecklistEntity.create(isSafeFacilityChecklist);
    }

    async subRemoveSafeFacilityChecklist(removeSafeFacilityChecklistDto: RemoveSafeFacilityChecklistDto) {
        const searchFilters = SafeFacilityChecklistFilter.setFilter(removeSafeFacilityChecklistDto);
        const isSafeFacilityChecklist = await this.fetch(searchFilters);
        if (!isSafeFacilityChecklist) {
            return false;
        }

        return await this.remove(searchFilters);
    }

    async subGetSafeFacilityChecklistsWithDeleted(getSafeFacilityChecklistWithDeletedDto: GetSafeFacilityChecklistDto) {
        const searchFilters = SafeFacilityChecklistFilter.setFilter(getSafeFacilityChecklistWithDeletedDto);
        const isSafeFacilityChecklists = await this.fetchAllWithDeleted(searchFilters);
        if (!isSafeFacilityChecklists) {
            return false;
        }

        return isSafeFacilityChecklists.map((sfc) => SafeFacilityChecklistEntity.create(sfc));
    }

    async subRestoreSafeFacilityChecklist(restoreSafeFacilityChecklist: GetSafeFacilityChecklistDto) {
        const searchFilters = SafeFacilityChecklistFilter.setFilter(restoreSafeFacilityChecklist);
        const isSafeFacilityChecklist = await this.restore(searchFilters);
        if (!isSafeFacilityChecklist) {
            return false;
        }

        return isSafeFacilityChecklist;
    }

    async subUpdateSafeFacilityChecklist(updateSafeFacilityChecklistDto: UpdateSafeFacilityChecklistDto) {
        const isDeletedSafeFacilityChecklists = await this.fetchAllWithDeleted({
            safeReportId: updateSafeFacilityChecklistDto.safeReportId as string
        });
        if (!isDeletedSafeFacilityChecklists) {
            await async.eachSeries(
                updateSafeFacilityChecklistDto.facilityChecklistId as string[],
                async (facilityChecklistId) => {
                    try {
                        await this.subAddSafeFacilityChecklist({
                            safeReportId: updateSafeFacilityChecklistDto.safeReportId as string,
                            facilityChecklistId: facilityChecklistId
                        });
                    } catch (error) {
                        await ErrorLog(error);
                    }
                }
            );

            return true;
        }

        const restoredSafeFacilityChecklists = await this.toBeRestored(
            isDeletedSafeFacilityChecklists,
            updateSafeFacilityChecklistDto
        );

        const isSafeFacilityChecklists = isDeletedSafeFacilityChecklists.filter((dsfc) => !dsfc.deletedAt);
        const facilityChecklistIds = isSafeFacilityChecklists.map((isfc) => isfc.facilityChecklistId);

        await this.toBeRemoved(facilityChecklistIds, updateSafeFacilityChecklistDto);

        await this.toBeAdded(facilityChecklistIds, updateSafeFacilityChecklistDto, restoredSafeFacilityChecklists);

        return true;
    }

    private async toBeAdded(
        facilityChecklistIds: string[],
        updateSafeFacilityChecklistDto: UpdateSafeFacilityChecklistDto,
        restoredSafeFacilityChecklists: SafeFacilityChecklist[]
    ) {
        const facilityChecklistIdsToBeAdded = (updateSafeFacilityChecklistDto.facilityChecklistId as string[]).filter(
            (facilityChecklistId) =>
                !facilityChecklistIds.includes(facilityChecklistId) &&
                !restoredSafeFacilityChecklists?.find((sfc) => sfc.facilityChecklistId === facilityChecklistId)
        );
        await async.eachSeries(facilityChecklistIdsToBeAdded, async (facilityChecklistId) => {
            try {
                await this.subAddSafeFacilityChecklist({
                    safeReportId: updateSafeFacilityChecklistDto.safeReportId as string,
                    facilityChecklistId: facilityChecklistId
                });
            } catch (error) {
                await ErrorLog(error);
            }
        });
    }
    private async toBeRestored(
        deletedSafeFacilityChecklist: SafeFacilityChecklist[],
        updateSafeFacilityChecklistDto: UpdateSafeFacilityChecklistDto
    ) {
        const safeFacilityChecklistToBeRestored = deletedSafeFacilityChecklist.filter(
            (dsfc) =>
                dsfc.deletedAt && updateSafeFacilityChecklistDto.facilityChecklistId?.includes(dsfc.facilityChecklistId)
        );
        await async.eachSeries(safeFacilityChecklistToBeRestored, async (sfcr) => {
            try {
                await this.subRestoreSafeFacilityChecklist({
                    safeReportId: updateSafeFacilityChecklistDto.safeReportId as string,
                    facilityChecklistId: sfcr.facilityChecklistId
                });
            } catch (error) {
                ErrorLog(error);
            }
        });

        return safeFacilityChecklistToBeRestored;
    }

    private async toBeRemoved(
        facilityChecklistIds: string[],
        updateSafeFacilityChecklistDto: UpdateSafeFacilityChecklistDto
    ) {
        const facilityChecklistIdsToBeRemoved = facilityChecklistIds.filter(
            (fcId) => !updateSafeFacilityChecklistDto.facilityChecklistId?.includes(fcId)
        );
        await async.eachSeries(facilityChecklistIdsToBeRemoved, async (facilityChecklistId) => {
            try {
                await this.subRemoveSafeFacilityChecklist({
                    safeReportId: updateSafeFacilityChecklistDto.safeReportId as string,
                    facilityChecklistId: facilityChecklistId as string
                });
            } catch (error) {
                await ErrorLog(error);
            }
        });
    }
}
