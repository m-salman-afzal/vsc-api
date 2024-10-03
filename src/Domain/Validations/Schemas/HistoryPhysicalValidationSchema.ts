import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const HistoryPhysicalValidationSchema = z
    .object({
        isYearly: z.coerce.boolean(),
        to: z.coerce.date(),
        from: z.coerce.date(),
        facilityId: stringValidation
    })
    .partial();
