import {In, IsNull, Like} from "typeorm";

import type {IFacilityUnitEntity} from "@entities/FacilityUnit/FacilityUnitEntity";
import type {FacilityUnit} from "@infrastructure/Database/Models/FacilityUnit";
import type {ReplaceKeys} from "@typings/Misc";
import type {TWhereFilter} from "@typings/ORM";

type TFilterFacilityUnits = ReplaceKeys<
    Partial<IFacilityUnitEntity>,
    "facilityId" | "facilityUnitId" | "cartId",
    {facilityId: string | string[]; facilityUnitId: string | string[]; cartId: string | null}
>;

type TWhereFacilityUnit = TWhereFilter<FacilityUnit>;

export class FacilityUnitFilter {
    private where: TWhereFacilityUnit;
    constructor(filters: TFilterFacilityUnits) {
        this.where = {};
        this.setFacilityId(filters);
        this.setUnit(filters);
        this.setFacilityUnitId(filters);
        this.setCartId(filters);
        this.setIsCartOrIsHnP(filters);
    }

    static setFilter(filters: TFilterFacilityUnits) {
        return new FacilityUnitFilter(filters).where;
    }

    setFacilityId(filters: TFilterFacilityUnits) {
        if (Array.isArray(filters.facilityId)) {
            this.where.facilityId = In(filters.facilityId);

            return;
        }

        if (filters.facilityId) {
            this.where.facilityId = filters.facilityId;
        }
    }

    setUnit(filters: TFilterFacilityUnits) {
        if (filters.unit) {
            this.where.unit = Like(`%${filters.unit}%`);
        }
    }

    setIsCartOrIsHnP(filters: TFilterFacilityUnits) {
        if (filters.isCart) {
            this.where.isCart = filters.isCart;
        }

        if (filters.isHnP) {
            this.where.isHnP = filters.isHnP;
        }
    }

    setFacilityUnitId(filters: TFilterFacilityUnits) {
        if (Array.isArray(filters.facilityUnitId)) {
            this.where.facilityUnitId = In(filters.facilityUnitId);

            return;
        }

        if (filters.facilityUnitId) {
            this.where.facilityUnitId = filters.facilityUnitId;
        }
    }

    setCartId(filters: TFilterFacilityUnits) {
        if (filters.cartId) {
            this.where.cartId = filters.cartId;
        }
        if (filters.cartId === null) {
            this.where.cartId = IsNull();
        }
    }
}
