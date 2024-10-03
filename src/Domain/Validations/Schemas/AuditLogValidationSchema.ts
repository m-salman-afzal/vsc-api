import {z} from "zod";

import {LOG_ACTIONS, LOG_ENTITIES} from "@constants/AuditLogConstant";
import {DATE_VALIDATION} from "@constants/RegexConstant";

import {ORDER_BY} from "@appUtils/Constants";

import {stringValidation} from "./ValidationTypes";

export const AuditLogValidationSchema = z
    .object({
        auditLogId: stringValidation,
        action: z.nativeEnum(LOG_ACTIONS),
        entity: z.nativeEnum(LOG_ENTITIES),
        entityId: stringValidation,
        text: stringValidation,
        toDate: z.string().regex(DATE_VALIDATION, "Invalid date"),
        fromDate: z.string().regex(DATE_VALIDATION, "Invalid date"),
        patientId: stringValidation,
        adminId: stringValidation,
        sort: z.nativeEnum(ORDER_BY)
    })
    .partial();

export const AuditLogSearchValidationSchema = z
    .object({
        text: stringValidation
    })
    .partial();
