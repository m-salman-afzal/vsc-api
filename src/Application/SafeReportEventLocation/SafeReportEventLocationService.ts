import async from "async";
import {inject, injectable} from "tsyringe";

import {SafeReportEventLocationEntity} from "@entities/SafeReportEventLocation/SafeReportEventLocationEntity";

import {ORDER_BY} from "@appUtils/Constants";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {SafeReportEventLocationFilter} from "@repositories/Shared/ORM/SafeReportEventLocationFilter";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddSafeReportEventLocationDto} from "./Dtos/AddSafeReportEventLocationDto";
import type {GetSafeReportEventLocationDto} from "./Dtos/GetSafeReportEventLocationDto";
import type {RemoveSafeReportEventLocationDto} from "./Dtos/RemoveSafeReportEventLocationDto";
import type {UpdateSafeReportEventLocationDto} from "./Dtos/UpdateSafeReportEventLocationDto";
import type {ISafeReportEventLocationRepository} from "@entities/SafeReportEventLocation/ISafeReportEventLocationRepository";
import type {SafeEventLocation} from "@infrastructure/Database/Models/SafeEventLocation";
import type {SafeReportEventLocation} from "@infrastructure/Database/Models/SafeReportEventLocation";

@injectable()
export class SafeReportEventLocationService extends BaseService<
    SafeReportEventLocation,
    SafeReportEventLocationEntity
> {
    constructor(
        @inject("ISafeReportEventLocationRepository")
        safeReportEventLocationRepository: ISafeReportEventLocationRepository
    ) {
        super(safeReportEventLocationRepository);
    }

    async subAddSafeReportEventLocation(addSafeReportEventLocationDto: AddSafeReportEventLocationDto) {
        const searchFilters = SafeReportEventLocationFilter.setFilter(addSafeReportEventLocationDto);
        const isSafeReportEventLocation = await this.fetch(searchFilters);
        if (isSafeReportEventLocation) {
            return false;
        }

        const safeReportEventLocationEntity = SafeReportEventLocationEntity.create(addSafeReportEventLocationDto);
        safeReportEventLocationEntity.safeReportEventLocationId = SharedUtils.shortUuid();
        await this.create(safeReportEventLocationEntity);

        return safeReportEventLocationEntity;
    }

    async subGetSafeReportEventLocation(getSafeReportEventLocationDto: GetSafeReportEventLocationDto) {
        const searchFilters = SafeReportEventLocationFilter.setFilter(getSafeReportEventLocationDto);
        const isSafeReportEventLocation = await this.fetchAll(searchFilters, {
            id: ORDER_BY.ASC
        });
        if (!isSafeReportEventLocation) {
            return false;
        }

        return SafeReportEventLocationEntity.create(isSafeReportEventLocation);
    }

    async subRemoveSafeReportEventLocation(removeSafeReportEventLocationDto: RemoveSafeReportEventLocationDto) {
        const searchFilters = SafeReportEventLocationFilter.setFilter(removeSafeReportEventLocationDto);
        const isSafeReportEventLocation = await this.fetch(searchFilters);
        if (!isSafeReportEventLocation) {
            return false;
        }

        return await this.remove(searchFilters);
    }

    async subGetSafeReportEventLocationsWithDeleted(
        getSafeReportEventLocationWithDeletedDto: GetSafeReportEventLocationDto
    ) {
        const searchFilters = SafeReportEventLocationFilter.setFilter(getSafeReportEventLocationWithDeletedDto);
        const isSafeReportEventLocations = await this.fetchAllWithDeleted(searchFilters);
        if (!isSafeReportEventLocations) {
            return false;
        }

        return isSafeReportEventLocations.map((sfc) => SafeReportEventLocationEntity.create(sfc));
    }

    async subRestoreSafeReportEventLocation(restoreSafeReportEventLocation: GetSafeReportEventLocationDto) {
        const searchFilters = SafeReportEventLocationFilter.setFilter(restoreSafeReportEventLocation);
        const isSafeReportEventLocation = await this.restore(searchFilters);
        if (!isSafeReportEventLocation) {
            return false;
        }

        return isSafeReportEventLocation;
    }

    async subUpdateSafeReportEventLocation(
        updateSafeReportEventLocationDto: UpdateSafeReportEventLocationDto,
        safeEventLocations: SafeEventLocation[]
    ) {
        const isDeletedSafeReportEventLocations = await this.fetchAllWithDeleted({
            safeReportId: updateSafeReportEventLocationDto.safeReportId as string
        });
        if (!isDeletedSafeReportEventLocations) {
            return false;
        }

        const restoredSafeReportEventLocations = await this.toBeRestored(
            isDeletedSafeReportEventLocations,
            updateSafeReportEventLocationDto,
            safeEventLocations
        );

        const isSafeReportEventLocations = isDeletedSafeReportEventLocations.filter((dsrel) => !dsrel.deletedAt);
        const safeEventLocationIds = isSafeReportEventLocations.map((isrel) => isrel.safeEventLocationId);

        await this.toBeRemoved(safeEventLocationIds, updateSafeReportEventLocationDto);

        await this.toBeAdded(
            safeEventLocationIds,
            updateSafeReportEventLocationDto,
            restoredSafeReportEventLocations,
            safeEventLocations
        );

        return true;
    }

    private async toBeAdded(
        safeEventLocationIds: string[],
        updateSafeReportEventLocationDto: UpdateSafeReportEventLocationDto,
        restoredSafeReportEventLocations: SafeReportEventLocation[],
        safeEventLocations: SafeEventLocation[]
    ) {
        const safeEventLocationIdsToBeAdded = (updateSafeReportEventLocationDto.safeEventLocationId as string[]).filter(
            (safeEventLocationId) =>
                !safeEventLocationIds.includes(safeEventLocationId) &&
                !restoredSafeReportEventLocations?.find((sfc) => sfc.safeEventLocationId === safeEventLocationId)
        );

        await async.eachSeries(safeEventLocationIdsToBeAdded, async (safeEventLocationId) => {
            try {
                await this.subAddSafeReportEventLocation({
                    safeReportId: updateSafeReportEventLocationDto.safeReportId as string,
                    safeEventLocationId: safeEventLocationId,
                    description: updateSafeReportEventLocationDto.safeReportEventLocation?.find(
                        (srel) =>
                            srel.location ===
                            safeEventLocations.find((sel) => sel.safeEventLocationId === safeEventLocationId)?.location
                    )?.description as string
                });

                await this.update(
                    {
                        safeReportId: updateSafeReportEventLocationDto.safeReportId as string,
                        safeEventLocationId: safeEventLocationId
                    },
                    SafeReportEventLocationEntity.create({
                        description: updateSafeReportEventLocationDto.safeReportEventLocation?.find(
                            (srel) =>
                                srel.location ===
                                safeEventLocations.find((sel) => sel.safeEventLocationId === safeEventLocationId)
                                    ?.location
                        )?.description as string
                    })
                );
            } catch (error) {
                await ErrorLog(error);
            }
        });
    }
    private async toBeRestored(
        deletedSafeReportEventLocation: SafeReportEventLocation[],
        updateSafeReportEventLocationDto: UpdateSafeReportEventLocationDto,
        safeEventLocations: SafeEventLocation[]
    ) {
        const safeReportEventLocationsToBeRestored = deletedSafeReportEventLocation.filter(
            (dsrel) =>
                dsrel.deletedAt &&
                updateSafeReportEventLocationDto.safeEventLocationId?.includes(dsrel.safeEventLocationId)
        );
        await async.eachSeries(safeReportEventLocationsToBeRestored, async (srelr) => {
            try {
                await this.subRestoreSafeReportEventLocation({
                    safeReportId: updateSafeReportEventLocationDto.safeReportId as string,
                    safeEventLocationId: srelr.safeEventLocationId
                });

                await this.update(
                    {
                        safeReportId: updateSafeReportEventLocationDto.safeReportId as string,
                        safeEventLocationId: srelr.safeEventLocationId
                    },
                    SafeReportEventLocationEntity.create({
                        description: updateSafeReportEventLocationDto.safeReportEventLocation?.find(
                            (srel) =>
                                srel.location ===
                                safeEventLocations.find((sel) => sel.safeEventLocationId === srelr.safeEventLocationId)
                                    ?.location
                        )?.description as string
                    })
                );
            } catch (error) {
                ErrorLog(error);
            }
        });

        return safeReportEventLocationsToBeRestored;
    }

    private async toBeRemoved(
        safeEventLocationsIds: string[],
        updateSafeReportEventLocationDto: UpdateSafeReportEventLocationDto
    ) {
        const safeEventLocationIdsToBeRemoved = safeEventLocationsIds.filter(
            (selId) => !updateSafeReportEventLocationDto.safeEventLocationId?.includes(selId)
        );
        await async.eachSeries(safeEventLocationIdsToBeRemoved, async (safeEventLocationId) => {
            try {
                await this.subRemoveSafeReportEventLocation({
                    safeReportId: updateSafeReportEventLocationDto.safeReportId as string,
                    safeEventLocationId: safeEventLocationId as string
                });
            } catch (error) {
                await ErrorLog(error);
            }
        });
    }
}
