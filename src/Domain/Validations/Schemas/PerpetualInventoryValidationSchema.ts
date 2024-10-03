import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const PerpetualInventoryValidationSchema = z
    .object({
        cartId: stringValidation,
        facilityId: stringValidation,
        text: stringValidation,
        staffName: stringValidation,
        staffSignature: stringValidation,
        perpetualInventoryId: stringValidation,
        controlledId: stringValidation,
        tr: stringValidation,
        rx: stringValidation,
        quantityAllocated: z.number(),
        patientName: stringValidation,
        providerName: stringValidation,
        comment: stringValidation
    })
    .partial();
