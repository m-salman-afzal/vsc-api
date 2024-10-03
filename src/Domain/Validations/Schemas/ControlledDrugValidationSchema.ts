import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const ControlledDrugValidationSchema = z
    .object({
        id: z.number(),
        controlledDrugId: stringValidation,
        controlledId: stringValidation,
        controlledType: stringValidation,
        tr: stringValidation,
        rx: stringValidation,
        patientName: stringValidation,
        controlledQuantity: z.number(),
        controlledDrugAutoId: z.number()
    })
    .partial();
