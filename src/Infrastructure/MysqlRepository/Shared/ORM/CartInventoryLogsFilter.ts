import {And, LessThanOrEqual, MoreThanOrEqual} from "typeorm";

import SharedUtils from "@appUtils/SharedUtils";

import type {TCartInventoryLogsEntity} from "@entities/CartInventoryLogs/CartInventoryLogsEntity";
import type {CartInventoryLogs} from "@infrastructure/Database/Models/CartInventoryLogs";
import type {TWhereFilter} from "@typings/ORM";

type TFilterCartInventoryLogs = Partial<TCartInventoryLogsEntity> & {fromDate?: string; toDate?: string};

type TWhereCart = TWhereFilter<CartInventoryLogs>;

export class CartInventoryLogsFilter {
    private where: TWhereCart;
    constructor(filters: TFilterCartInventoryLogs) {
        this.where = {};
        this.setDateRange(filters);
        this.setFacilityId(filters);
        this.setCart(filters);
    }

    static setFilter(filters: TFilterCartInventoryLogs) {
        return new CartInventoryLogsFilter(filters).where;
    }

    setDateRange(filters: TFilterCartInventoryLogs) {
        if (filters.fromDate && filters.toDate) {
            this.where.createdAt = And(
                MoreThanOrEqual(SharedUtils.setDateStartHours(filters.fromDate)),
                LessThanOrEqual(SharedUtils.setDateEndHours(filters.toDate))
            );
        }
    }

    setFacilityId(filters: TFilterCartInventoryLogs) {
        if (filters.facilityId) {
            this.where.facilityId = filters.facilityId;
        }
    }

    setCart(filters: TFilterCartInventoryLogs) {
        if (filters.cart) {
            this.where.cart = filters.cart;
        }
    }
}
