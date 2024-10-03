import {z} from "zod";

import {CART_ALLOCATION_STATUS, CART_PICK_STATUS} from "@constants/CartRequestConstant";

import {stringValidation} from "./ValidationTypes";

export const CartRequestDrugValidationSchema = z
    .object({
        cartRequestDrugId: stringValidation.or(z.array(stringValidation)),
        packageQuantity: z.number(),
        controlledId: stringValidation,
        tr: stringValidation,
        pickStatus: z.nativeEnum(CART_PICK_STATUS),
        allocationStatus: z.nativeEnum(CART_ALLOCATION_STATUS),
        cartRequestFormId: stringValidation,
        cartId: stringValidation,
        referenceGuideDrugId: stringValidation,
        facilityId: stringValidation,
        cartRequestLogId: stringValidation,
        formularyId: stringValidation.or(z.array(stringValidation)),
        pickedByAdminId: stringValidation,
        allocatedByAdminId: stringValidation,
        pickedAt: stringValidation,
        allocatedAt: stringValidation,
        cartRequestAllocationLogId: stringValidation,
        cartRequestPickLogId: stringValidation,
        cartRequestDeletionLogId: stringValidation,
        totalUnits: z.number()
    })
    .partial();
