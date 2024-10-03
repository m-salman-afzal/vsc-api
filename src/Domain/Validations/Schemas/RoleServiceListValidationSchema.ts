import {z} from "zod";

import {PERMISSIONS} from "@constants/AuthConstant";

import {stringValidation} from "./ValidationTypes";

export const RoleServiceListValidationSchema = z
    .object({
        roleServiceListId: stringValidation.or(z.array(stringValidation)),
        roleId: stringValidation,
        serviceListId: stringValidation,
        permission: z.nativeEnum(PERMISSIONS)
    })
    .partial();
