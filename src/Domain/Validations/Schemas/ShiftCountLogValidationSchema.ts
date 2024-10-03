import {array, z} from "zod";

import {ShiftCountLogDrugValidationSchema} from "./ShiftCountLogDrugValidationSchema";
import {booleanValidation, stringValidation} from "./ValidationTypes";

export const ShiftCountLogValidationSchema = z
    .object({
        cartId: stringValidation,
        facilityId: stringValidation,
        fromDate: stringValidation,
        toDate: stringValidation,
        handOffName: stringValidation,
        receiverName: stringValidation,
        handOffSignature: stringValidation,
        receiverSignature: stringValidation,
        comment: stringValidation,
        searchText: stringValidation,
        isDiscrepancy: booleanValidation,
        shiftCountLogDrugs: array(
            ShiftCountLogDrugValidationSchema.required({
                controlledId: true,
                name: true,
                countedQuantity: true,
                quantityOnHand: true
            })
                .partial({
                    tr: true,
                    rx: true
                })
                .omit({
                    shiftCountLogId: true
                })
        )
    })
    .partial();
