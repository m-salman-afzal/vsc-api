import AdminValidationSchema from "@validations/Schemas/AdminValidationSchema";

import {FacilityValidationSchema} from "./Schemas/FacilityValidationSchema";
import {RoleValidationSchema} from "./Schemas/RoleValidationSchema";

class AdminValidation {
    static addAdminValidation(body: unknown) {
        const addAdmin = AdminValidationSchema.merge(FacilityValidationSchema)
            .merge(RoleValidationSchema)
            .required({
                firstName: true,
                lastName: true,
                email: true,
                roleId: true
            })
            .partial({
                facilityId: true,
                externalFacilityId: true
            })
            .refine((data) => Array.isArray(data.facilityId) || Array.isArray(data.externalFacilityId), {
                message: "facilityId or externalFacilityId should be an array"
            });

        return addAdmin.parse(body);
    }

    static getAdminValidation(body: unknown) {
        const getAdmin = AdminValidationSchema.merge(FacilityValidationSchema)
            .partial({
                firstName: true,
                lastName: true,
                email: true,
                adminType: true,
                facilityId: true
            })
            .refine((data) => !Array.isArray(data.facilityId), {
                message: "facilityId cannot be an array"
            });

        return getAdmin.parse(body);
    }

    static updateAdminValidation(body: unknown) {
        const updateAdmin = AdminValidationSchema.partial({
            adminId: true,
            firstName: true,
            lastName: true,
            email: true,
            adminType: true
        });

        return updateAdmin.parse(body);
    }

    static removeAdminValidation(body: unknown) {
        const removeAdmin = AdminValidationSchema.required({
            adminId: true
        });

        return removeAdmin.parse(body);
    }

    static bulkRemoveAdminValidation(body: unknown) {
        const bulkRemoveAdmin = AdminValidationSchema.pick({
            adminId: true,
            adminType: true
        });

        return bulkRemoveAdmin.parse(body);
    }

    static bulkUpsertAdminValidation(body: unknown) {
        const bulkUpsertAdmin = AdminValidationSchema.merge(FacilityValidationSchema)
            .merge(RoleValidationSchema)
            .required({
                firstName: true,
                lastName: true,
                email: true
            })
            .partial({
                roleId: true,
                facilityId: true,
                externalFacilityId: true
            })
            .refine((data) => Array.isArray(data.facilityId) || Array.isArray(data.externalFacilityId), {
                message: "facilityId or externalFacilityId should be an array"
            });

        return bulkUpsertAdmin.parse(body);
    }
}

export default AdminValidation;
