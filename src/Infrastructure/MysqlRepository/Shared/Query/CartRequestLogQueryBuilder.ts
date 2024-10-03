import {Brackets} from "typeorm";

import {CART_REQUEST_TYPE} from "@constants/CartRequestConstant";

import type {ICartRequestDrugEntity} from "@entities/CartRequestDrug/CartRequestDrugEntity";
import type {ICartRequestLogEntity} from "@entities/CartRequestLog/CartRequestLogEntity";
import type {CartRequestLog} from "@infrastructure/Database/Models/CartRequestLog";
import type {ReplaceKeys} from "@typings/Misc";
import type {TQueryBuilder} from "@typings/ORM";

export type TFilterCartRequestLog = ReplaceKeys<
    Partial<ICartRequestLogEntity> &
        Partial<ICartRequestDrugEntity> &
        Partial<{
            toDate: string;
            fromDate: string;
            cartId: string;
            text: string;
            inventoryFacilityId: string;
            name: string;
            forRequestLog: boolean;
            forRestockLog: boolean;
        }>,
    "type",
    {type: string | string[]}
>;

type TQueryBuilderCartRequestLog = TQueryBuilder<CartRequestLog>;

export class CartRequestLogQueryBuilder {
    private query: TQueryBuilderCartRequestLog;
    constructor(query: TQueryBuilderCartRequestLog, filters: TFilterCartRequestLog) {
        this.query = query;
        this.setFacility(filters);
        this.setCreatedAt(filters);
        this.setText(filters);
        this.setName(filters);
        this.setCartId(filters);
        this.setAllocationStatus(filters);
        this.setPickStatus(filters);
        this.setAdminId(filters);
        this.setAllocatedByAdminId(filters);
        this.setType(filters);
        this.setForRestockLog(filters);
    }

    static setFilter(query: TQueryBuilderCartRequestLog, filters: TFilterCartRequestLog) {
        return new CartRequestLogQueryBuilder(query, filters).query;
    }

    setFacility(filters: TFilterCartRequestLog) {
        if (filters.facilityId) {
            this.query.andWhere("cartRequestLog.facilityId = :facilityId", {facilityId: filters.facilityId});
        }
    }

    setCreatedAt(filters: TFilterCartRequestLog) {
        if (filters.toDate && filters.fromDate) {
            this.query.andWhere("cartRequestLog.createdAt BETWEEN :fromDate AND :toDate", {
                fromDate: filters.fromDate,
                toDate: `${filters.toDate} 23:59:59`
            });
        }
    }

    setType(filters: TFilterCartRequestLog) {
        if (Array.isArray(filters.type)) {
            this.query.andWhere("cartRequestLog.type IN (:...type)", {
                type: filters.type
            });

            return;
        }

        if (filters.type) {
            this.query.andWhere("cartRequestLog.type = :type", {
                type: filters.type
            });
        }
    }

    setAdminId(filters: TFilterCartRequestLog) {
        if (filters.adminId) {
            this.query.andWhere("cartRequestLog.adminId = :adminId", {
                adminId: filters.adminId
            });
        }
    }

    setText(filters: TFilterCartRequestLog) {
        if (filters.text) {
            this.query.andWhere(
                new Brackets((qb) => {
                    qb.orWhere("admin.firstName LIKE :text", {text: `%${filters.text}%`});
                    qb.orWhere("admin.lastName LIKE :text", {text: `%${filters.text}%`});
                })
            );
        }
    }

    setName(filters: TFilterCartRequestLog) {
        if (filters.name) {
            this.query.andWhere("formulary.name LIKE :name ", {
                name: `%${filters.name}%`
            });
        }
    }

    setCartId(filters: TFilterCartRequestLog) {
        if (filters.forRequestLog && filters.cartId) {
            this.query.andWhere("cartRequestDrug.cartId = :cartId", {
                cartId: filters.cartId
            });

            return;
        }

        if (filters.cartId) {
            this.query.andWhere("cartRequestAllocationDrug.cartId = :cartId", {
                cartId: filters.cartId
            });
        }
    }

    setPickStatus(filters: TFilterCartRequestLog) {
        if (filters.pickStatus) {
            this.query.andWhere("cartRequestAllocationDrug.pickStatus = :pickStatus", {
                pickStatus: filters.pickStatus
            });
        }
    }

    setAllocationStatus(filters: TFilterCartRequestLog) {
        if (filters.allocationStatus) {
            this.query.andWhere("cartRequestAllocationDrug.allocationStatus = :allocationStatus", {
                allocationStatus: filters.allocationStatus
            });
        }
    }

    setAllocatedByAdminId(filters: TFilterCartRequestLog) {
        if (filters.allocatedByAdminId) {
            this.query.andWhere("cartRequestAllocationDrug.allocatedByAdminId = :allocatedByAdminId", {
                allocatedByAdminId: filters.allocatedByAdminId
            });
        }
    }

    setForRestockLog(filters: TFilterCartRequestLog) {
        if (
            filters.forRestockLog &&
            !(
                filters.type?.includes(CART_REQUEST_TYPE.AFTER_HOUR) ||
                filters.type?.includes(CART_REQUEST_TYPE.STANDARD)
            )
        ) {
            this.query.andWhere(
                "(cartRequestPickDrug.cartRequestDrugId IS NOT NULL OR cartRequestAllocationDrug.cartRequestDrugId IS NOT NULL OR cartRequestDeletionDrug.cartRequestDrugId IS NOT NULL)"
            );
        }
    }
}
