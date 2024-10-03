import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const ShiftCountLogDrugValidationSchema = z
    .object({
        shiftCountLogId: stringValidation,
        controlledId: stringValidation,
        tr: stringValidation,
        rx: stringValidation,
        name: stringValidation,
        countedQuantity: z.number(),
        quantityOnHand: z.number()
    })
    .partial();
