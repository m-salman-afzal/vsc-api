import {Like} from "typeorm";

import type {ICartEntity} from "@entities/Cart/CartEntity";
import type {Cart} from "@infrastructure/Database/Models/Cart";
import type {TWhereFilter} from "@typings/ORM";

type TFilterCarts = Partial<ICartEntity>;

type TWhereCart = TWhereFilter<Cart>;

export class CartFilter {
    private where: TWhereCart;
    constructor(filters: TFilterCarts) {
        this.where = {};
        this.setCartName(filters);
        this.setFacilityId(filters);
    }

    static setFilter(filters: TFilterCarts) {
        return new CartFilter(filters).where;
    }

    setCartName(filters: TFilterCarts) {
        if (filters.cart) {
            this.where.cart = Like(`%${filters.cart}%`);
        }
    }

    setFacilityId(filters: TFilterCarts) {
        if (filters.facilityId) {
            this.where.facilityId = filters.facilityId;
        }
    }
}
