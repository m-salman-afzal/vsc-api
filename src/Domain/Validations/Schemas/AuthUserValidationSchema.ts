import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

const AuthUserValidationSchema = z
    .object({
        email: z.string().email(),
        password: stringValidation,
        confirmPassword: stringValidation,
        resetPasswordToken: z.string(),
        appVersion: z.string(),
        appName: z.string()
    })
    .partial();

export default AuthUserValidationSchema;
