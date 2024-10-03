import {CartRequestDrugValidationSchema} from "./Schemas/CartRequestDrugValidationSchema";
import {CartRequestLogValidationSchema} from "./Schemas/CartRequestLogValidationSchema";
import PaginationValidationSchema from "./Schemas/PaginationValidationSchema";

export class CartRequestLogValidation {
    static GetCartRequestLogsValidation(body: unknown) {
        const row = CartRequestLogValidationSchema.merge(CartRequestDrugValidationSchema)
            .merge(PaginationValidationSchema)
            .required({facilityId: true, type: true})
            .partial({
                fromDate: true,
                toDate: true,
                cartId: true,
                currentPage: true,
                perPage: true,
                adminId: true,
                text: true
            })
            .refine((data) => Array.isArray(data.type), {message: "type must be an array"});

        return row.parse(body);
    }
}
