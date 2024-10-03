import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";
import {SEARCH_HISTORY_PHYSICAL_REPOSITORY_FIELDS} from "@repositories/Shared/Query/FieldsBuilder";
import {HistoryPhysicalQueryBuilder} from "@repositories/Shared/Query/HistoryPhysicalQueryBuilder";

import {HistoryPhysical} from "@infrastructure/Database/Models/HistoryPhysical";

import type {HistoryPhysicalEntity} from "@entities/HistoryPhysical/HistoryPhysicalEntity";
import type IHistoryPhysicalRepository from "@entities/HistoryPhysical/IHistoryPhysicalRepository";
import type {TSearchFilters} from "@typings/ORM";

@injectable()
export class HistoryPhysicalRepository
    extends BaseRepository<HistoryPhysical, HistoryPhysicalEntity>
    implements IHistoryPhysicalRepository
{
    constructor() {
        super(HistoryPhysical);
    }

    async fetchBySearchQuery(searchFilters: TSearchFilters<HistoryPhysical>) {
        const query = this.model
            .createQueryBuilder("historyPhysical")
            .leftJoin("historyPhysical.patient", "patient")
            .leftJoin("historyPhysical.facility", "facility")
            .where("1=1")
            .orderBy("historyPhysical.annualDate", "ASC")
            .addOrderBy("historyPhysical.initialDate", "ASC");

        const queryFilters = HistoryPhysicalQueryBuilder.setFilter(query, searchFilters);

        const historyPhysical = await queryFilters.select(SEARCH_HISTORY_PHYSICAL_REPOSITORY_FIELDS).getRawMany();

        if (historyPhysical.length === 0) {
            return false;
        }

        return historyPhysical;
    }
}
