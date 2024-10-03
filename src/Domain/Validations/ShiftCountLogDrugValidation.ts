import PaginationValidationSchema from "./Schemas/PaginationValidationSchema";
import {ShiftCountLogDrugValidationSchema} from "./Schemas/ShiftCountLogDrugValidationSchema";

export class ShiftCountLogDrugValidation {
    static getShiftCountLogDrugsValidation(body: unknown) {
        const getShiftCountLogDrugs = ShiftCountLogDrugValidationSchema.merge(PaginationValidationSchema)
            .required({shiftCountLogId: true})
            .partial({
                currentPage: true,
                perPage: true
            })
            .omit({
                controlledId: true,
                tr: true,
                rx: true,
                name: true,
                countedQuantity: true,
                quantityOnHand: true
            });

        return getShiftCountLogDrugs.parse(body);
    }
}
