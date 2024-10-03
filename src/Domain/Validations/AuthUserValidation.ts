import AuthUserValidationSchema from "@validations/Schemas/AuthUserValidationSchema";

class AuthUserValidation {
    static loginValidation(body: unknown) {
        const login = AuthUserValidationSchema.required({
            email: true,
            password: true,
            appVersion: true,
            appName: true
        });

        return login.parse(body);
    }

    static forgotPasswordValidation(body: unknown) {
        const forgotPassword = AuthUserValidationSchema.required({
            email: true,
            appVersion: true,
            appName: true
        });

        return forgotPassword.parse(body);
    }

    static resetPasswordValidation(body: unknown) {
        const resetPassword = AuthUserValidationSchema.required({
            password: true,
            confirmPassword: true,
            resetPasswordToken: true,
            appName: true
        }).refine((data) => data.password === data.confirmPassword, {message: "Passwords do not match"});

        return resetPassword.parse(body);
    }
}

export default AuthUserValidation;
