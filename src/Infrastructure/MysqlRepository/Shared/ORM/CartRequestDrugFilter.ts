import {In} from "typeorm";

import type {ICartRequestDrugEntity} from "@entities/CartRequestDrug/CartRequestDrugEntity";
import type {CartRequestDrug} from "@infrastructure/Database/Models/CartRequestDrug";
import type {ReplaceKeys} from "@typings/Misc";
import type {TWhereFilter} from "@typings/ORM";

type TFilterCartRequestDrug = ReplaceKeys<
    Partial<ICartRequestDrugEntity>,
    "cartRequestPickLogId" | "cartRequestAllocationLogId" | "cartRequestDeletionLogId" | "cartRequestDrugId",
    {
        cartRequestPickLogId: string | string[];
        cartRequestAllocationLogId: string | string[];
        cartRequestDeletionLogId: string | string[];
        cartRequestDrugId: string | string[];
    }
>;

type TWhereCartRequestDrug = TWhereFilter<CartRequestDrug>;

export class CartRequestDrugFilter {
    private where: TWhereCartRequestDrug;
    constructor(filters: TFilterCartRequestDrug) {
        this.where = {};

        this.setCartRequestPickLogId(filters);
        this.setCartRequestAllocationLogId(filters);
        this.setCartRequestDeletionLogId(filters);
        this.setCartRequestDrugId(filters);
    }

    static setFilter(filters: TFilterCartRequestDrug) {
        return new CartRequestDrugFilter(filters).where;
    }

    setCartRequestPickLogId(filters: TFilterCartRequestDrug) {
        if (filters.cartRequestPickLogId && Array.isArray(filters.cartRequestPickLogId)) {
            this.where.cartRequestPickLogId = In(filters.cartRequestPickLogId);

            return;
        }

        if (filters.cartRequestPickLogId) {
            this.where.cartRequestPickLogId = filters.cartRequestPickLogId;
        }
    }

    setCartRequestAllocationLogId(filters: TFilterCartRequestDrug) {
        if (filters.cartRequestAllocationLogId && Array.isArray(filters.cartRequestAllocationLogId)) {
            this.where.cartRequestAllocationLogId = In(filters.cartRequestAllocationLogId);

            return;
        }

        if (filters.cartRequestAllocationLogId) {
            this.where.cartRequestAllocationLogId = filters.cartRequestAllocationLogId;
        }
    }

    setCartRequestDeletionLogId(filters: TFilterCartRequestDrug) {
        if (filters.cartRequestDeletionLogId && Array.isArray(filters.cartRequestDeletionLogId)) {
            this.where.cartRequestDeletionLogId = In(filters.cartRequestDeletionLogId);

            return;
        }

        if (filters.cartRequestDeletionLogId) {
            this.where.cartRequestDeletionLogId = filters.cartRequestDeletionLogId;
        }
    }

    setCartRequestDrugId(filters: TFilterCartRequestDrug) {
        if (filters.cartRequestDrugId && Array.isArray(filters.cartRequestDrugId)) {
            this.where.cartRequestDrugId = In(filters.cartRequestDrugId);

            return;
        }

        if (filters.cartRequestDrugId) {
            this.where.cartRequestDrugId = filters.cartRequestDrugId;
        }
    }
}
