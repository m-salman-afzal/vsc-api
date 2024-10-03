import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const ReferenceGuideDrugValidationSchema = z
    .object({
        referenceGuideDrugId: stringValidation,
        category: stringValidation,
        subCategory: stringValidation,
        min: z.number(),
        max: z.number(),
        notes: stringValidation,
        formularyId: stringValidation,
        drug: stringValidation,
        referenceGuideId: stringValidation,
        id: z.number().nonnegative()
    })
    .partial();
