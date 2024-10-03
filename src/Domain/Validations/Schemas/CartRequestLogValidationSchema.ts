import {z} from "zod";

import {CART_REQUEST_TYPE} from "@constants/CartRequestConstant";
import {CONTROLLED_TYPE} from "@constants/InventoryConstant";
import {DATE_VALIDATION} from "@constants/RegexConstant";

import {stringValidation} from "./ValidationTypes";

export const CartRequestLogValidationSchema = z
    .object({
        cartRequestLogId: stringValidation,
        type: z.nativeEnum(CART_REQUEST_TYPE).or(z.array(z.nativeEnum(CART_REQUEST_TYPE))),
        receiverName: stringValidation,
        controlledType: z.nativeEnum(CONTROLLED_TYPE),
        receiverSignature: stringValidation,
        witnessName: stringValidation,
        witnessSignature: stringValidation,
        adminId: stringValidation,
        facilityId: stringValidation,
        fromDate: z.string().regex(DATE_VALIDATION),
        toDate: z.string().regex(DATE_VALIDATION),
        cartId: stringValidation,
        canUndo: z.boolean(),
        text: stringValidation
    })
    .partial();
