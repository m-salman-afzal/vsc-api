import {z} from "zod";

import {FACILITY_CHECKLIST_EVENTS} from "@constants/FacilityChecklistConstant";
import {DATE_VALIDATION} from "@constants/RegexConstant";
import {REPORT_TYPES, SAFE_REPORT_STATUS} from "@constants/ReportConstant";

import {booleanValidation, stringValidation} from "./ValidationTypes";

export const ReportValidationSchema = z
    .object({
        reportId: stringValidation,
        status: z.nativeEnum(SAFE_REPORT_STATUS).or(z.array(z.nativeEnum(SAFE_REPORT_STATUS))),
        isAnonymous: booleanValidation,
        type: z.nativeEnum(REPORT_TYPES),
        description: z.string().trim().min(10),
        adminId: stringValidation,
        facilityId: stringValidation,
        safeReportId: stringValidation,
        safeFacilityChecklist: z.array(z.nativeEnum(FACILITY_CHECKLIST_EVENTS)),
        safeReportEventLocation: z.array(stringValidation),
        fromDate: z.string().regex(DATE_VALIDATION),
        toDate: z.string().regex(DATE_VALIDATION),
        investigationAdminId: stringValidation,
        text: stringValidation
    })
    .partial();
