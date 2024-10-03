import {z} from "zod";

import {booleanValidation, stringValidation} from "./ValidationTypes";

export const FormularyLevelValidationSchema = z
    .object({
        formularyLevelId: stringValidation.or(z.array(stringValidation)),
        min: z.number(),
        max: z.number(),
        parLevel: z.number(),
        threshold: z.number(),
        isStock: booleanValidation,
        orderedQuantity: z.number(),
        isCentralSupply: booleanValidation
    })
    .partial();
