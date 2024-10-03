import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const UserSettingValidationSchema = z
    .object({
        userSettingId: stringValidation,
        setting: z.object({defaultFacilityId: stringValidation}),
        adminId: stringValidation,
        defaultFacilityId: stringValidation.or(z.string())
    })
    .partial();
