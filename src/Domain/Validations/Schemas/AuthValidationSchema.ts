import {z} from "zod";

import {APP_VERSION_VALIDATION, EMAIL_VALIDATION} from "@constants/RegexConstant";

import {stringValidation} from "./ValidationTypes";

const AuthValidationSchema = z
    .object({
        email: z.string().email().regex(EMAIL_VALIDATION),
        password: stringValidation,
        confirmPassword: stringValidation,
        resetPasswordToken: z.string(),
        appVersion: z.string().regex(APP_VERSION_VALIDATION)
    })
    .partial();

export default AuthValidationSchema;
