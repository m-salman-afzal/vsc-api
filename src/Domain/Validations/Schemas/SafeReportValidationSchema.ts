import {z} from "zod";

import {DATE_VALIDATION} from "@constants/RegexConstant";
import {SAFE_INVOLVED_PARTIES} from "@constants/ReportConstant";

import {stringValidation} from "./ValidationTypes";

export const SafeReportValidationSchema = z
    .object({
        safeReportId: stringValidation,
        patientName: stringValidation,
        date: z.string().regex(DATE_VALIDATION),
        time: z.string(),
        severityType: stringValidation,
        nearMisstype: stringValidation,
        isPatientHarmed: z.boolean(),
        sbarrSituation: stringValidation,
        sbarrBackground: stringValidation,
        sbarrAction: stringValidation,
        sbarrRecommendation: stringValidation,
        sbarrResult: stringValidation,
        interventionDescription: z.string().trim().min(0),
        involvedParty: z.nativeEnum(SAFE_INVOLVED_PARTIES),
        involvedPartyText: z.string().trim().min(0),
        findings: z.string().trim().min(0),
        detail: stringValidation
    })
    .partial();
