import AuthValidationSchema from "@validations/Schemas/AuthValidationSchema";

class AuthValidation {
    static loginValidation(body: unknown) {
        const login = AuthValidationSchema.required({
            email: true,
            password: true,
            appVersion: true
        });

        return login.parse(body);
    }

    static forgotPasswordValidation(body: unknown) {
        const forgotPassword = AuthValidationSchema.required({
            email: true,
            appVersion: true
        });

        return forgotPassword.parse(body);
    }

    static resetPasswordValidation(body: unknown) {
        const resetPassword = AuthValidationSchema.required({
            password: true,
            confirmPassword: true,
            resetPasswordToken: true
        }).refine((data) => data.password === data.confirmPassword, {message: "Passwords do not match"});

        return resetPassword.parse(body);
    }
}

export default AuthValidation;
