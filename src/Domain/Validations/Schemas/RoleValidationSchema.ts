import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const RoleValidationSchema = z
    .object({
        roleId: stringValidation.or(z.array(stringValidation)),
        name: stringValidation,
        position: z.number().nonnegative(),
        defaultPermission: stringValidation,
        colorCode: stringValidation
    })
    .partial();
