import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const SafeFacilityChecklistValidationSchema = z
    .object({
        safeFacilityChecklistId: stringValidation,
        safeReportId: stringValidation,
        facilityChecklistId: stringValidation
    })
    .partial();
