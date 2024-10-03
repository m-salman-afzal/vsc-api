import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const ServiceListValidationSchema = z
    .object({
        serviceListId: stringValidation.or(z.array(stringValidation)),
        name: stringValidation
    })
    .partial();
