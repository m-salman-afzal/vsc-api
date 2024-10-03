import {z} from "zod";

import {ORDER_BY} from "@appUtils/Constants";

import {stringValidation} from "./ValidationTypes";

export const BridgeTherapyLogValidationSchema = z
    .object({
        bridgeTherapyLogId: stringValidation,
        filename: stringValidation,
        adminId: stringValidation,
        facilityId: stringValidation,
        sort: z.nativeEnum(ORDER_BY),
        bridgeTherapyLogCreatedAt: stringValidation,
        text: stringValidation
    })
    .partial();
