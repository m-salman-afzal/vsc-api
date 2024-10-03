import type {TCartInventoryLogsEntity} from "@entities/CartInventoryLogs/CartInventoryLogsEntity";
import type {CartInventoryLogs} from "@infrastructure/Database/Models/CartInventoryLogs";
import type {TQueryBuilder} from "@typings/ORM";

export type TFilterCartInventoryLogs = Partial<TCartInventoryLogsEntity>;

type TQueryBuilderCartInventoryLogs = TQueryBuilder<CartInventoryLogs>;

export class CartInventoryLogsQueryBuilder {
    private query: TQueryBuilderCartInventoryLogs;
    constructor(query: TQueryBuilderCartInventoryLogs, filters: TFilterCartInventoryLogs) {
        this.query = query;

        this.setFacilityId(filters);
    }

    static setFilter(query: TQueryBuilderCartInventoryLogs, filters: TFilterCartInventoryLogs) {
        return new CartInventoryLogsQueryBuilder(query, filters).query;
    }

    setFacilityId(filters: TFilterCartInventoryLogs) {
        if (filters.facilityId) {
            this.query.andWhere("cartInventoryLogs.facilityId = :facilityId", {
                facilityId: filters.facilityId
            });
        }
    }
}
