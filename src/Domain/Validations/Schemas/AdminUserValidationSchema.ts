import {z} from "zod";

import {LOGIN_TYPE, SHERIFF_OFFICE_ACCESS_ROLES} from "@constants/AuthConstant";

import {stringValidation} from "./ValidationTypes";

const AdminUserValidationSchema = z
    .object({
        adminId: stringValidation,
        firstName: stringValidation,
        lastName: stringValidation,
        email: z.string().email(),
        password: stringValidation,
        confirmPassword: stringValidation,
        resetPasswordToken: z.string(),
        passwordResetOn: z.string(),
        loginTries: z.number(),
        adminType: z.nativeEnum(SHERIFF_OFFICE_ACCESS_ROLES),
        sessionId: stringValidation,
        loginType: z.nativeEnum(LOGIN_TYPE)
    })
    .partial();

export default AdminUserValidationSchema;
