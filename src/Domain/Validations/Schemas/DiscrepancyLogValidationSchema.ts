import {z} from "zod";

import {DISCREPENCY_LOG_LEVELS, DISCREPENCY_LOG_TYPES} from "@constants/DiscrepencyLogConstant";
import {DATE_VALIDATION} from "@constants/RegexConstant";

import {stringValidation} from "./ValidationTypes";

export const DiscrepancyLogValidationSchema = z
    .object({
        discrepancyLogId: stringValidation,
        facilityId: stringValidation,
        adminId: stringValidation,
        type: z.nativeEnum(DISCREPENCY_LOG_TYPES),
        level: z.nativeEnum(DISCREPENCY_LOG_LEVELS).or(z.string().trim().min(1)),
        perpetualInventoryDeductionId: stringValidation,
        comment: stringValidation,
        toDate: z.string().regex(DATE_VALIDATION, "Invalid date"),
        fromDate: z.string().regex(DATE_VALIDATION, "Invalid date"),
        name: stringValidation
    })
    .partial();
