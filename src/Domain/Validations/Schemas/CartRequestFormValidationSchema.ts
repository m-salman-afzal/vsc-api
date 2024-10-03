import {z} from "zod";

import {booleanValidation, stringValidation} from "./ValidationTypes";

export const CartRequestFormValidationSchema = z
    .object({
        cartRequestFormId: stringValidation,
        pendingOrderQuantity: z.number(),
        cartId: stringValidation,
        referenceGuideDrugId: stringValidation,
        facilityId: stringValidation,
        isControlled: booleanValidation
    })
    .partial();
