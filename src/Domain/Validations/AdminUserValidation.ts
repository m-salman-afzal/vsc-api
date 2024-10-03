import AdminUserValidationSchema from "@validations/Schemas/AdminUserValidationSchema";

import PaginationValidationSchema from "./Schemas/PaginationValidationSchema";

class AdminUserValidation {
    /**
     * @param body
     */
    static addAdminUserValidation(body: unknown) {
        const addAdmin = AdminUserValidationSchema.required({
            firstName: true,
            lastName: true,
            email: true,
            adminType: true
        });

        return addAdmin.parse(body);
    }

    /**
     * @param body
     */
    static getAdminUserValidation(body: unknown) {
        const getAdmin = AdminUserValidationSchema.merge(PaginationValidationSchema).partial({
            firstName: true,
            lastName: true,
            email: true,
            adminType: true,
            currentPage: true,
            perPage: true
        });

        return getAdmin.parse(body);
    }

    /**
     * @param body
     */
    static updateAdminUserValidation(body: unknown) {
        const updateAdmin = AdminUserValidationSchema.required({
            adminId: true
        }).partial({
            firstName: true,
            lastName: true,
            email: true,
            adminType: true
        });

        return updateAdmin.parse(body);
    }

    /**
     * @param body
     */
    static removeAdminUserValidation(body: unknown) {
        const removeAdmin = AdminUserValidationSchema.required({
            adminId: true
        });

        return removeAdmin.parse(body);
    }

    /**
     * @param body
     */
    static updateAdminProfileValidation(body: unknown) {
        const updateAdminProfile = AdminUserValidationSchema.required({
            adminId: true
        }).partial({
            firstName: true,
            lastName: true
        });

        return updateAdminProfile.parse(body);
    }

    /**
     * @param body
     */
    static updateAdminPasswordValidation(body: unknown) {
        const updateAdminPassword = AdminUserValidationSchema.required({
            adminId: true
        })
            .partial({
                password: true,
                confirmPassword: true
            })
            .refine((data) => data.password === data.confirmPassword, {message: "Passwords do not match"});

        return updateAdminPassword.parse(body);
    }

    static validateAdminUserPasswordValidation(body: unknown) {
        const validateAdminPassword = AdminUserValidationSchema.required({
            adminId: true,
            password: true
        });

        return validateAdminPassword.parse(body);
    }
}

export default AdminUserValidation;
