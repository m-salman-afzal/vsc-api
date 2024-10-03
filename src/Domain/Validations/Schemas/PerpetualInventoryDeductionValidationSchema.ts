import {z} from "zod";

import {PERPETUAL_SIGNATURE_TYPES} from "@constants/PerpetualInventoryConstant";
import {PERPETUAL_INVENTORY_DEDUCTION_TYPES} from "@constants/PerpetualInventoryDeductionConstant";

import {stringValidation} from "./ValidationTypes";

export const PerpetualInventoryDeductionValidationSchema = z
    .object({
        staffName: stringValidation,
        witnessName: stringValidation,
        nurseName: stringValidation,
        quantityDeducted: z.number(),
        patientName: stringValidation,
        providerName: stringValidation,
        date: stringValidation,
        time: stringValidation,
        adminId: stringValidation,
        type: z.nativeEnum(PERPETUAL_INVENTORY_DEDUCTION_TYPES),
        perpetualInventoryDeductionId: stringValidation,
        signatureType: z.nativeEnum(PERPETUAL_SIGNATURE_TYPES),
        comment: z.string().min(10)
    })
    .partial();
