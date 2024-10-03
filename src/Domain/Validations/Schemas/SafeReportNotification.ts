import {z} from "zod";

import {booleanValidation, stringValidation} from "./ValidationTypes";

export const SafeReportNotificationValidationObject = z
    .object({
        adminId: stringValidation,
        facilityId: z.array(stringValidation).or(stringValidation),
        isArchived: booleanValidation,
        notificationId: stringValidation
    })
    .partial();
