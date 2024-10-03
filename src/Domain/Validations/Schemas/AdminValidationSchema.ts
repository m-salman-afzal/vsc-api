import {z} from "zod";

import {ACCESS_ROLES, LOGIN_TYPE} from "@constants/AuthConstant";
import {EMAIL_VALIDATION} from "@constants/RegexConstant";

const stringValidation = z.string().trim().min(1, {message: "String required"});
const AdminValidationSchema = z
    .object({
        adminId: stringValidation,
        firstName: stringValidation,
        lastName: stringValidation,
        email: z.string().email().regex(EMAIL_VALIDATION, {message: "Invalid email"}),
        password: stringValidation,
        resetPasswordToken: z.string(),
        passwordResetOn: z.string(),
        loginTries: z.number(),
        adminType: z.nativeEnum(ACCESS_ROLES),
        sessionId: stringValidation,
        loginType: z.nativeEnum(LOGIN_TYPE),
        id: z.number().nonnegative({message: "Invalid id"})
    })
    .partial();

export default AdminValidationSchema;
