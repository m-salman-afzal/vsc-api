import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const ShiftCountValidationSchema = z
    .object({
        cartId: stringValidation,
        facilityId: stringValidation,
        name: stringValidation
    })
    .partial();
