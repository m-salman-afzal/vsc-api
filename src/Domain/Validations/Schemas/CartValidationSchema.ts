import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const CartValidationSchema = z
    .object({
        facilityId: stringValidation,
        referenceGuideId: stringValidation,
        cart: stringValidation.or(z.array(stringValidation)),
        cartId: stringValidation,
        units: z.array(stringValidation)
    })
    .partial();
