import {z} from "zod";

import {BOOLEAN_VALUES} from "@appUtils/Constants";

const stringValidation = z.string().trim().min(1);
export const NotificationAdminValidationObject = z
    .object({
        notificationAdminId: stringValidation,
        isRead: z.boolean().or(z.nativeEnum(BOOLEAN_VALUES)),
        isArchived: z.boolean().or(z.nativeEnum(BOOLEAN_VALUES))
    })
    .partial();
