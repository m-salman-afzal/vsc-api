import {z} from "zod";

import {DATE_VALIDATION} from "@constants/RegexConstant";

const stringValidation = z.string().trim().min(1, {message: "String required"});

export const CentralSupplyLogValidationSchema = z
    .object({
        centralSupplyLogId: stringValidation,
        orderedQuantity: z.number().or(stringValidation),
        adminId: stringValidation,
        facilityId: stringValidation,
        orderedQuantityMin: z.number().or(stringValidation),
        orderedQuantityMax: z.number().or(stringValidation),
        toDate: z.string().regex(DATE_VALIDATION, "Invalid date"),
        fromDate: z.string().regex(DATE_VALIDATION, "Invalid date"),
        text: stringValidation
    })
    .partial();
