import {FacilityAdminValidationSchema} from "@validations/Schemas/FacilityAdminValidationSchema";

class FacilityAdminValidation {
    static addFacilityAdminValidation(body: unknown) {
        const addFacilityAdmin = FacilityAdminValidationSchema.required({
            facilityId: true,
            adminId: true
        });

        return addFacilityAdmin.parse(body);
    }

    static removeFacilityAdminValidation(body: unknown) {
        const removeFacility = FacilityAdminValidationSchema.refine((data) => !Array.isArray(data.facilityId), {
            message: "facilityId cannot be an array"
        }).refine((data) => data.adminId || data.facilityAdminId || data.facilityId, {
            message: "adminId, facilityId or facilityAdminId must be given"
        });

        return removeFacility.parse(body);
    }
}

export default FacilityAdminValidation;
