import type {ICartEntity} from "@entities/Cart/CartEntity";
import type {IDiscrepancyLogEntity} from "@entities/DiscrepancyLog/DiscrepancyLogEntity";
import type {DiscrepancyLog} from "@infrastructure/Database/Models/DiscrepancyLog";
import type {TQueryBuilder} from "@src/typings/ORM";

export type TFilterDiscrepancyLog = Partial<
    IDiscrepancyLogEntity &
        ICartEntity & {
            name: string;
            fromDate: string;
            toDate: string;
        }
>;
type TQueryBuilderDiscrepancyLog = TQueryBuilder<DiscrepancyLog>;

export class DiscrepancyLogQueryBuilder {
    private query: TQueryBuilderDiscrepancyLog;
    constructor(query: TQueryBuilderDiscrepancyLog, filters: TFilterDiscrepancyLog) {
        this.query = query;

        this.setName(filters);
        this.setCreatedAt(filters);
        this.setType(filters);
        this.setFacilityId(filters);
    }

    static setFilter(query: TQueryBuilderDiscrepancyLog, filters: TFilterDiscrepancyLog) {
        return new DiscrepancyLogQueryBuilder(query, filters).query;
    }

    setName(filters: TFilterDiscrepancyLog) {
        if (filters.name) {
            this.query.andWhere(
                "(perpetualInventory.name LIKE :name OR perpetualInventoryFromDeduction.name LIKE :name)",
                {
                    name: `%${filters.name}%`
                }
            );
        }
    }

    setCreatedAt(filters: TFilterDiscrepancyLog) {
        if (filters.toDate && filters.fromDate) {
            this.query.andWhere("discrepancyLog.createdAt BETWEEN :fromDate AND :toDate", {
                toDate: filters.toDate,
                fromDate: `${filters.fromDate} 23:59:59`
            });
        }
    }

    setType(filters: TFilterDiscrepancyLog) {
        if (filters.type) {
            this.query.andWhere("discrepancyLog.type = :type", {
                type: filters.type
            });
        }
    }

    setFacilityId(filters: TFilterDiscrepancyLog) {
        if (filters.facilityId) {
            this.query.andWhere("discrepancyLog.facilityId = :facilityId", {
                facilityId: filters.facilityId
            });
        }
    }

    setCartId(filters: TFilterDiscrepancyLog) {
        if (filters.cartId) {
            this.query.andWhere("discrepancyLog.cartId = :cartId", {
                cartId: filters.cartId
            });
        }
    }
}
