import {z} from "zod";

import {IMAGE_VALIDATION} from "@constants/RegexConstant";

import {stringValidation} from "./ValidationTypes";

export const InventoryControlValidationSchema = z
    .object({
        inventoryControlId: stringValidation,
        receiverName: stringValidation,
        witnessName: stringValidation,
        receiverSignature: stringValidation,
        witnessSignature: stringValidation,
        signature: z.object({
            receiverSignature: z.string().regex(IMAGE_VALIDATION),
            witnessSignature: z.string().regex(IMAGE_VALIDATION)
        })
    })
    .partial();
