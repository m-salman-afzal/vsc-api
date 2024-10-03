import SharedUtils from "@appUtils/SharedUtils";

import type {IShiftCountLogEntity} from "@entities/ShiftCountLog/ShiftCountLogEntity";
import type {ShiftCountLogs} from "@infrastructure/Database/Models/ShiftCountLogs";
import type {TQueryBuilder} from "@src/typings/ORM";

export type TFilterShiftCountLogs = Pick<IShiftCountLogEntity, "cartId" | "facilityId"> & {
    fromDate: string;
    toDate: string;
};
type TQueryBuilderShiftCountLogs = TQueryBuilder<ShiftCountLogs>;

export class ShiftCountLogsQueryBuilder {
    private query: TQueryBuilderShiftCountLogs;
    constructor(query: TQueryBuilderShiftCountLogs, filters: TFilterShiftCountLogs) {
        this.query = query;
        this.setCartId(filters);
        this.setFacilityId(filters);
    }

    static setFilter(query: TQueryBuilderShiftCountLogs, filters: TFilterShiftCountLogs) {
        return new ShiftCountLogsQueryBuilder(query, filters).query;
    }

    setCartId(filters: TFilterShiftCountLogs) {
        if (filters.cartId) {
            this.query.andWhere("shiftCountLogs.cartId = :cartId", {cartId: filters.cartId});
        }
    }

    setFacilityId(filters: TFilterShiftCountLogs) {
        if (filters.facilityId) {
            this.query.andWhere("shiftCountLogs.facilityId = :facilityId", {
                facilityId: filters.facilityId
            });
        }
    }

    setDateRange(filters: TFilterShiftCountLogs) {
        if (filters.fromDate) {
            this.query.andWhere("shiftCountLogs.createdAt >= :fromDate", {
                fromDate: SharedUtils.setDateStartHours(filters.fromDate)
            });
        }

        if (filters.toDate) {
            this.query.andWhere("shiftCountLogs.createdAt <= :toDate", {
                toDate: SharedUtils.setDateEndHours(filters.toDate)
            });
        }
    }
}
