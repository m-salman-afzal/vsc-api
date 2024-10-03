import PaginationValidationSchema from "./Schemas/PaginationValidationSchema";
import {ShiftCountValidationSchema} from "./Schemas/ShiftCountValidationSchema";

export class ShiftCountValidation {
    static getShiftCountValidation(body: unknown) {
        const getShiftCount = ShiftCountValidationSchema.merge(PaginationValidationSchema)
            .required({facilityId: true})
            .partial({
                currentPage: true,
                perPage: true,
                cartId: true,
                name: true
            });

        return getShiftCount.parse(body);
    }

    static getCartsValidation(body: unknown) {
        const getCarts = ShiftCountValidationSchema.required({
            facilityId: true
        });

        return getCarts.parse(body);
    }
}
