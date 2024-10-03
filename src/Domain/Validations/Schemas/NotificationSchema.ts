import {z} from "zod";

import {BOOLEAN_VALUES} from "@appUtils/Constants";

const stringValidation = z.string().trim().min(1);
export const NotificationValidationObject = z
    .object({
        adminId: stringValidation,
        facilityId: z.array(stringValidation).or(stringValidation),
        isArchived: z.boolean().or(z.nativeEnum(BOOLEAN_VALUES)),
        isAlert: z.boolean().or(z.nativeEnum(BOOLEAN_VALUES)),
        notificationId: stringValidation,
        screen: stringValidation
    })
    .partial();
