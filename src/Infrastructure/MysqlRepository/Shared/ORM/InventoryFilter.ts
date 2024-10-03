import {In, LessThan} from "typeorm";

import {TIMEZONES} from "@appUtils/Constants";
import SharedUtils from "@appUtils/SharedUtils";

import type {IInventoryEntity} from "@entities/Inventory/InventoryEntity";
import type {Inventory} from "@infrastructure/Database/Models/Inventory";
import type {TWhereFilter} from "@typings/ORM";

type TFilterInventory = Omit<Partial<IInventoryEntity>, "formularyId"> & {
    formularyId?: string | string[];
    pastExpiry?: boolean;
};

type TWhereInventory = TWhereFilter<Inventory>;

export class InventoryFilter {
    private where: TWhereInventory;

    constructor(filters: TFilterInventory) {
        this.where = {};

        this.setInventoryId(filters);
        this.setNdc(filters);
        this.setFormularyId(filters);
        this.setIsActive(filters);
        this.setFacilityId(filters);
        this.setlotNo(filters);
        this.setExpirationDate(filters);
        this.setManufacturer(filters);
        this.setId(filters);
        this.setPastExpiry(filters);
    }

    static setFilter(filters: TFilterInventory) {
        return new InventoryFilter(filters).where;
    }

    setInventoryId(filters: TFilterInventory) {
        if (filters.inventoryId) {
            this.where.inventoryId = filters.inventoryId;
        }
    }

    setFormularyId(filters: TFilterInventory) {
        if (Array.isArray(filters.formularyId)) {
            this.where.formularyId = In(filters.formularyId);

            return;
        }
        if (filters.formularyId) {
            this.where.formularyId = filters.formularyId;
        }
    }

    setNdc(filters: TFilterInventory) {
        if (filters.ndc) {
            this.where.ndc = filters.ndc;
        }
    }

    setIsActive(filters: TFilterInventory) {
        if ("isActive" in filters && filters.isActive !== undefined && filters.isActive !== null) {
            this.where.isActive = filters.isActive;
        }
    }

    setFacilityId(filters: TFilterInventory) {
        if (filters.facilityId) {
            this.where.facilityId = filters.facilityId;
        }
    }

    setlotNo(filters: TFilterInventory) {
        if (filters.lotNo) {
            this.where.lotNo = filters.lotNo;
        }
    }

    setExpirationDate(filters: TFilterInventory) {
        if (filters.expirationDate) {
            this.where.expirationDate = filters.expirationDate;
        }
    }

    setManufacturer(filters: TFilterInventory) {
        if (filters.manufacturer) {
            this.where.manufacturer = filters.manufacturer;
        }
    }
    setId(filters: TFilterInventory) {
        if (filters.id && !Array.isArray(filters.id)) {
            this.where.id = filters.id;
        }
    }

    setPastExpiry(filters: TFilterInventory) {
        if (filters.pastExpiry) {
            this.where.expirationDate = LessThan(SharedUtils.getCurrentDate({timezone: TIMEZONES.AMERICA_NEWYORK}));
        }
    }
}
