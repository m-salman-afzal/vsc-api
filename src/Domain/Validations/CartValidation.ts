import {CartValidationSchema} from "@validations/Schemas/CartValidationSchema";

import PaginationValidationSchema from "./Schemas/PaginationValidationSchema";

class CartValidation {
    static addCartValidation(body: unknown) {
        const addCart = CartValidationSchema.required({
            cart: true,
            units: true,
            facilityId: true,
            referenceGuideId: true
        });

        return addCart.parse(body);
    }

    static updateCartValidation(body: unknown) {
        const updateCart = CartValidationSchema.required({
            cartId: true
        });

        return updateCart.parse(body);
    }

    static deleteCartValidation(body: unknown) {
        const addCart = CartValidationSchema.required({
            cartId: true
        });

        return addCart.parse(body);
    }

    static getPaginatedCartValidation(body: unknown) {
        const addCart = CartValidationSchema.merge(PaginationValidationSchema).partial({
            cart: true,
            facilityId: true,
            currentPage: true,
            perPage: true
        });

        return addCart.parse(body);
    }

    static getCartValidation(body: unknown) {
        const addCart = CartValidationSchema.partial({
            cart: true,
            facilityId: true
        });

        return addCart.parse(body);
    }

    static getCartNamesValidation(body: unknown) {
        const addCart = CartValidationSchema.required({
            facilityId: true
        });

        return addCart.parse(body);
    }
}

export default CartValidation;
