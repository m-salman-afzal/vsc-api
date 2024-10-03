import {In, MoreThanOrEqual} from "typeorm";

import type {IControlledDrugEntity} from "@entities/ControlledDrug/ControlledDrugEntity";
import type {ControlledDrug} from "@infrastructure/Database/Models/ControlledDrug";
import type {TWhereFilter} from "@typings/ORM";

type TFilterControlledDrug = Omit<
    Partial<IControlledDrugEntity>,
    "inventoryId" | "controlledId" | "cartId" | "tr" | "rx"
> & {
    inventoryId?: string | string[];
    controlledId?: string | string[];
    cartId?: string | string[] | undefined;
    tr?: string | undefined;
    rx?: string | undefined;
    id?: number;
};

type TWhereControlledDrug = TWhereFilter<ControlledDrug>;

export class ControlledDrugFilter {
    private where: TWhereControlledDrug;

    constructor(filters: TFilterControlledDrug) {
        this.where = {};

        this.setId(filters);
        this.setControlledDrugId(filters);
        this.setControlledId(filters);
        this.setTr(filters);
        this.setMinQuantity(filters);
        this.setInventoryId(filters);
        this.setInventoryId(filters);
        this.setControlledId(filters);
        this.setCartId(filters);
        this.setTr(filters);
        this.setRx(filters);
        this.setControlledType(filters);
    }

    static setFilter(filters: TFilterControlledDrug) {
        return new ControlledDrugFilter(filters).where;
    }

    setId(filters: TFilterControlledDrug) {
        if (filters.id) {
            this.where.id = filters.id;
        }
    }

    setControlledDrugId(filters: TFilterControlledDrug) {
        if (filters.controlledDrugId) {
            this.where.controlledDrugId = filters.controlledDrugId;
        }
    }

    setInventoryId(filters: TFilterControlledDrug) {
        if (Array.isArray(filters.inventoryId)) {
            this.where.inventoryId = In(filters.inventoryId);

            return;
        }

        if (filters.inventoryId) {
            this.where.inventoryId = filters.inventoryId;
        }
    }

    setMinQuantity(filters: TFilterControlledDrug) {
        if (filters.controlledQuantity) {
            this.where.controlledQuantity = MoreThanOrEqual(filters.controlledQuantity);
        }
    }

    setControlledId(filters: TFilterControlledDrug) {
        if (Array.isArray(filters.controlledId)) {
            this.where.controlledId = In(filters.controlledId);

            return;
        }

        if (filters.controlledId) {
            this.where.controlledId = filters.controlledId;
        }
    }

    setCartId(filters: TFilterControlledDrug) {
        if (Array.isArray(filters.cartId)) {
            this.where.cartId = In(filters.cartId);

            return;
        }

        if (filters.cartId) {
            this.where.cartId = filters.cartId;
        }
    }

    setTr(filters: TFilterControlledDrug) {
        if (filters.tr) {
            this.where.tr = filters.tr;
        }
    }

    setRx(filters: TFilterControlledDrug) {
        if (filters.rx) {
            this.where.rx = filters.rx;
        }
    }

    setControlledType(filters: TFilterControlledDrug) {
        if (filters.controlledType) {
            this.where.controlledType = filters.controlledType;
        }
    }
}
