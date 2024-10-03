import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {SafeFacilityChecklist} from "@infrastructure/Database/Models/SafeFacilityChecklist";

import {SafeFacilityChecklistQueryBuilder} from "./Shared/Query/SafeFacilityChecklistQueryBuilder";

import type {TFilterSafeFacilityChecklist} from "./Shared/Query/SafeFacilityChecklistQueryBuilder";
import type {ISafeFacilityChecklistRepository} from "@entities/SafeFacilityChecklist/ISafeFacilityChecklistRepository";
import type {SafeFacilityChecklistEntity} from "@entities/SafeFacilityChecklist/SafeFacilityChecklistEntity";

@injectable()
export class SafeFacilityChecklistRepository
    extends BaseRepository<SafeFacilityChecklist, SafeFacilityChecklistEntity>
    implements ISafeFacilityChecklistRepository
{
    constructor() {
        super(SafeFacilityChecklist);
    }

    async fetchAllSafeReportCheckList(searchFilter: TFilterSafeFacilityChecklist) {
        const query = this.model
            .createQueryBuilder("safeFacilityChecklist")
            .leftJoinAndSelect("safeFacilityChecklist.facilityChecklist", "facilityChecklist");

        const queryFilters = SafeFacilityChecklistQueryBuilder.setFilter(query, searchFilter);
        const rows = await queryFilters.getMany();

        if (rows.length === 0) {
            return false;
        }

        return rows;
    }
}
