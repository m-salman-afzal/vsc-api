import z from "zod";

import {SAFE_REPORT_EVENT_LOCATION} from "@constants/ReportConstant";

import {ReportValidationSchema} from "@validations/Schemas/ReportValidationSchema";

import PaginationValidationSchema from "./Schemas/PaginationValidationSchema";
import {SafeReportValidationSchema} from "./Schemas/SafeReportValidationSchema";
import {stringValidation} from "./Schemas/ValidationTypes";

export class ReportValidation {
    static addReportValidation(body: unknown) {
        const row = ReportValidationSchema.merge(
            z.object({
                safeReport: SafeReportValidationSchema.merge(
                    z.object({
                        safeReportEventLocation: z.array(
                            z.object({location: z.nativeEnum(SAFE_REPORT_EVENT_LOCATION), description: z.string()})
                        ),
                        safeFacilityChecklist: z.array(stringValidation)
                    })
                )
            })
        )

            .required({
                isAnonymous: true,
                type: true,
                description: true,
                adminId: true,
                facilityId: true
            })
            .partial({safeReport: true});

        return row.parse(body);
    }

    static getReportsValidation(body: unknown) {
        const row = ReportValidationSchema.merge(PaginationValidationSchema).partial({
            fromDate: true,
            toDate: true,
            type: true,
            status: true,
            currentPage: true,
            perPage: true,
            text: true,
            investigationAdminId: true,
            reportId: true
        });

        return row.parse(body);
    }

    static getReportValidation(body: unknown) {
        const row = ReportValidationSchema.required({reportId: true});

        return row.parse(body);
    }

    static updateReportValidation(body: unknown) {
        const row = ReportValidationSchema.merge(z.object({safeReport: SafeReportValidationSchema}))
            .merge(
                z.object({
                    safeReportEventLocation: z.array(
                        z.object({location: z.nativeEnum(SAFE_REPORT_EVENT_LOCATION), description: z.string()})
                    )
                })
            )
            .merge(z.object({safeAssignmentComment: stringValidation}))
            .required({
                reportId: true
            })
            .partial({
                isAnonymous: true,
                type: true,
                description: true,
                safeFacilityChecklist: true,
                safeReport: true,
                safeReportEventLocation: true,
                safeAssignmentComment: true
            });

        return row.parse(body);
    }

    static removeReportValidation(body: unknown) {
        const removeFacility = ReportValidationSchema.required({
            reportId: true
        });

        return removeFacility.parse(body);
    }
}
