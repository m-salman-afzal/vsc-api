import {Brackets} from "typeorm";

import type {ICartEntity} from "@entities/Cart/CartEntity";
import type {ICartRequestLogEntity} from "@entities/CartRequestLog/CartRequestLogEntity";
import type {IFormularyEntity} from "@entities/Formulary/FormularyEntity";
import type {Cart} from "@infrastructure/Database/Models/Cart";
import type {TQueryBuilder} from "@typings/ORM";

export type TFilterCart = Partial<ICartEntity> &
    Partial<IFormularyEntity> &
    Partial<ICartRequestLogEntity> & {
        unit?: string;
        assignedCartsOnly?: boolean;
        cartRequestFormFacilityId?: string;
    };
type TQueryBuilderCart = TQueryBuilder<Cart>;

export class CartQueryBuilder {
    private query: TQueryBuilderCart;
    constructor(query: TQueryBuilderCart, filters: TFilterCart) {
        this.query = query;
        this.setMultiple(filters);
        this.setFacility(filters);
        this.setAssignedCartsOnly(filters);
    }

    static setFilter(query: TQueryBuilderCart, filters: TFilterCart) {
        return new CartQueryBuilder(query, filters).query;
    }

    setFacility(filters: TFilterCart) {
        if (filters.facilityId) {
            this.query.andWhere("facility.facilityId = :facilityId", {facilityId: filters.facilityId});
        }
    }

    setMultiple(filters: TFilterCart) {
        if (filters.cart || filters.unit) {
            this.query.andWhere(
                new Brackets((qb) => {
                    qb.orWhere("carts.cart LIKE :cart", {
                        cart: `%${filters.cart}%`
                    });
                    qb.orWhere("facilityUnits.unit LIKE :unit", {
                        unit: `%${filters.unit}%`
                    });
                })
            );
        }
    }

    setAssignedCartsOnly(filters: TFilterCart) {
        if (filters.assignedCartsOnly) {
            this.query.andWhere("facilityUnits.cartId IS NOT NULL");
        }
    }

    setCartRequestFormFacilityId(filters: TFilterCart) {
        if (filters.cartRequestFormFacilityId) {
            this.query.andWhere("cartRequestForm.facilityId = :facilityId", {
                facilityId: filters.cartRequestFormFacilityId
            });
        }
    }
}
