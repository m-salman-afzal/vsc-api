import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const SafeAssignmentCommentValidationSchema = z
    .object({
        safeAssignmentCommentId: stringValidation,
        safeReportId: stringValidation,
        comment: stringValidation,
        adminId: stringValidation
    })
    .partial();
