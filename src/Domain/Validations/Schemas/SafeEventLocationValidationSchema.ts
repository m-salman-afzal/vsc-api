import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const SafeEventLocationValidationSchema = z
    .object({
        safeEventLocationId: stringValidation,
        location: stringValidation
    })
    .partial();
