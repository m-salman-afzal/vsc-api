import {And, LessThanOrEqual, MoreThanOrEqual} from "typeorm";

import SharedUtils from "@appUtils/SharedUtils";

import type {IInventoryHistoryEntity} from "@entities/InventoryHistory/InventoryHistoryEntity";
import type {InventoryHistory} from "@infrastructure/Database/Models/InventoryHistory";
import type {TWhereFilter} from "@typings/ORM";

type TFilterInventoryHistory = Partial<IInventoryHistoryEntity & {fromDate: string; toDate: string}>;

type TWhereCart = TWhereFilter<InventoryHistory>;

export class InventoryHistoryFilter {
    private where: TWhereCart;
    constructor(filters: TFilterInventoryHistory) {
        this.where = {};
        this.setDateRange(filters);
        this.setFacility(filters);
    }

    static setFilter(filters: TFilterInventoryHistory) {
        return new InventoryHistoryFilter(filters).where;
    }

    setDateRange(filters: TFilterInventoryHistory) {
        if (filters.fromDate && filters.toDate) {
            this.where.createdAt = And(
                MoreThanOrEqual(SharedUtils.setDateStartHours(filters.fromDate)),
                LessThanOrEqual(SharedUtils.setDateEndHours(filters.toDate))
            );
        }
    }

    setFacility(filters: TFilterInventoryHistory) {
        if (filters.facilityId) {
            this.where.facilityId = filters.facilityId;
        }
    }
}
