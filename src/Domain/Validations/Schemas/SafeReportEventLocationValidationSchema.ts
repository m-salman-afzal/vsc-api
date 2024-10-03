import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const SafeReportEventLocationValidationSchema = z
    .object({
        safeReportEventLocationId: stringValidation,
        safeReportId: stringValidation,
        safeEventLocationId: stringValidation,
        description: stringValidation
    })
    .partial();
