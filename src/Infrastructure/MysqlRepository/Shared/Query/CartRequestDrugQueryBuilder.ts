import {CART_ALLOCATION_STATUS, CART_REQUEST_TYPE} from "@constants/CartRequestConstant";

import SharedUtils from "@appUtils/SharedUtils";

import type {ICartRequestDrugEntity} from "@entities/CartRequestDrug/CartRequestDrugEntity";
import type {ICartRequestLogEntity} from "@entities/CartRequestLog/CartRequestLogEntity";
import type {IFormularyEntity} from "@entities/Formulary/FormularyEntity";
import type {IInventoryEntity} from "@entities/Inventory/InventoryEntity";
import type {CartRequestDrug} from "@infrastructure/Database/Models/CartRequestDrug";
import type {TQueryBuilder} from "@typings/ORM";

export type TFilterCartRequestDrug = Partial<ICartRequestDrugEntity> &
    Partial<IInventoryEntity> &
    Partial<ICartRequestLogEntity> &
    Partial<IFormularyEntity> &
    Partial<{
        toDate: string;
        fromDate: string;
        inventoryFacilityId: string;
        cartRequestLogType: string;
        isActiveInventoryForPick: boolean;
    }>;

type TQueryBuilderCartRequestDrug = TQueryBuilder<CartRequestDrug>;

export class CartRequestDrugQueryBuilder {
    private query: TQueryBuilderCartRequestDrug;
    constructor(query: TQueryBuilderCartRequestDrug, filters: TFilterCartRequestDrug) {
        this.query = query;
        this.setCartRequestLogId(filters);
        this.setFacilityId(filters);
        this.setCreatedAt(filters);
        this.setName(filters);
        this.setAllocationStatus(filters);
        this.setPickStatus(filters);
        this.setAdminId(filters);
        this.setAllocatedByAdminId(filters);
        this.setCartRequestAllocationLogId(filters);
        this.setCartRequestPickLogId(filters);
        this.setCartRequestDeletionLogId(filters);
        this.setCartId(filters);
        this.setAllocationUndo(filters);
        this.setIsControlled(filters);
        this.setCartRequestDrugId(filters);
        this.setFromPartial(filters);
        this.setPickUndo(filters);
        this.setIsActiveInventoryForPick(filters);
        this.setControlledType(filters);
    }

    static setFilter(query: TQueryBuilderCartRequestDrug, filters: TFilterCartRequestDrug) {
        return new CartRequestDrugQueryBuilder(query, filters).query;
    }

    setCartRequestLogId(filters: TFilterCartRequestDrug) {
        if (filters.cartRequestLogId) {
            this.query.andWhere("cartRequestDrug.cartRequestLogId = :cartRequestLogId", {
                cartRequestLogId: filters.cartRequestLogId
            });
        }
    }

    setCartRequestDrugId(filters: TFilterCartRequestDrug) {
        if (filters.cartRequestDrugId) {
            this.query.andWhere("cartRequestDrug.cartRequestDrugId = :cartRequestDrugId", {
                cartRequestDrugId: filters.cartRequestDrugId
            });
        }
    }

    setFacilityId(filters: TFilterCartRequestDrug) {
        if (filters.facilityId) {
            this.query.andWhere("cartRequestDrug.facilityId = :facilityId", {
                facilityId: filters.facilityId
            });
        }
    }

    setCreatedAt(filters: TFilterCartRequestDrug) {
        if (filters.toDate && filters.fromDate) {
            this.query.andWhere("cartRequestDrug.createdAt BETWEEN :fromDate AND :toDate", {
                toDate: filters.toDate,
                fromDate: `${filters.fromDate} 23:59:59`
            });
        }
    }

    setName(filters: TFilterCartRequestDrug) {
        if (filters.name) {
            this.query.andWhere("formulary.name LIKE :name ", {
                name: `%${filters.name}%`
            });
        }
    }

    setCartId(filters: TFilterCartRequestDrug) {
        if (filters.cartId) {
            this.query.andWhere("cartRequestDrug.cartId = :cartId", {
                cartId: filters.cartId
            });
        }
    }

    setAllocationStatus(filters: TFilterCartRequestDrug) {
        if (filters.allocationStatus) {
            this.query.andWhere(
                `(cartRequestDrug.allocationStatus = :allocationStatus OR cartRequestDrug.allocationStatus = :partialAllocationStatus)`,
                {
                    allocationStatus: filters.allocationStatus,
                    partialAllocationStatus: CART_ALLOCATION_STATUS.PARTIAL
                }
            );
        }
    }

    setPickStatus(filters: TFilterCartRequestDrug) {
        if (filters.pickStatus) {
            this.query.andWhere("cartRequestDrug.pickStatus = :pickStatus", {
                pickStatus: filters.pickStatus
            });
        }
    }

    setAdminId(filters: TFilterCartRequestDrug) {
        if (filters.adminId) {
            this.query.andWhere("cartRequestLog.adminId = :adminId", {
                adminId: filters.adminId
            });
        }
    }

    setAllocatedByAdminId(filters: TFilterCartRequestDrug) {
        if (filters.allocatedByAdminId) {
            this.query.andWhere("cartRequestDrug.allocatedByAdminId = :allocatedByAdminId", {
                allocatedByAdminId: filters.allocatedByAdminId
            });
        }
    }

    setCartRequestAllocationLogId(filters: TFilterCartRequestDrug) {
        if (filters.cartRequestAllocationLogId) {
            this.query.andWhere("cartRequestDrug.cartRequestAllocationLogId = :cartRequestAllocationLogId", {
                cartRequestAllocationLogId: filters.cartRequestAllocationLogId
            });
        }
    }

    setCartRequestPickLogId(filters: TFilterCartRequestDrug) {
        if (filters.cartRequestPickLogId) {
            this.query.andWhere("cartRequestDrug.cartRequestPickLogId = :cartRequestPickLogId", {
                cartRequestPickLogId: filters.cartRequestPickLogId
            });
        }
    }

    setCartRequestDeletionLogId(filters: TFilterCartRequestDrug) {
        if (filters.cartRequestDeletionLogId) {
            this.query.andWhere("cartRequestDrug.cartRequestDeletionLogId = :cartRequestDeletionLogId", {
                cartRequestDeletionLogId: filters.cartRequestDeletionLogId
            });
        }
    }

    setAllocationUndo(filters: TFilterCartRequestDrug) {
        if (filters.type === CART_REQUEST_TYPE.ALLOCATION) {
            this.query.andWhere("cartRequestAllocationLog.canUndo = true");
        }
    }

    setIsControlled(filters: TFilterCartRequestDrug) {
        if (SharedUtils.isFalsyBooleanPresent(filters, "isControlled")) {
            this.query.andWhere("formulary.isControlled = :isControlled", {isControlled: filters.isControlled});
        }
    }

    setFromPartial(filter: TFilterCartRequestDrug) {
        if (filter.cartRequestLogType && filter.cartRequestLogType === CART_REQUEST_TYPE.PICK) {
            this.query.andWhere("(cartRequestDrug.fromPartial = false OR cartRequestDrug.fromPartial IS NULL)");
        }
    }

    setIsActiveInventoryForPick(filters: TFilterCartRequestDrug) {
        if (SharedUtils.isFalsyBooleanPresent(filters, "isActiveInventoryForPick")) {
            this.query.andWhere("inventory.isActive = :isActiveInventoryForPick", {
                isActiveInventoryForPick: filters.isActiveInventoryForPick
            });
        }
    }

    setPickUndo(filters: TFilterCartRequestDrug) {
        if (filters.type === CART_REQUEST_TYPE.PICK) {
            this.query.andWhere("cartRequestPickLog.canUndo = true");
        }
    }

    setControlledType(filters: TFilterCartRequestDrug) {
        if (filters.controlledType) {
            this.query.andWhere(
                "(controlledDrug.controlledType = :controlledType OR controlledDrug.controlledType IS NULL)",
                {
                    controlledType: filters.controlledType
                }
            );
        }
    }
}
