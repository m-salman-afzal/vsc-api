import {FacilityUnitValidationSchema} from "@validations/Schemas/FacilityUnitValidationSchema";

class FacilityUnitValidation {
    static addFacilityUnitValidation(body: unknown) {
        const addFacilityUnit = FacilityUnitValidationSchema.required({
            facilityId: true,
            unit: true,
            drugCount: true,
            quantity: true,
            patientCount: true
        });

        return addFacilityUnit.parse(body);
    }

    static updateFacilityUnitValidation(body: unknown) {
        const updateFacilityUnit = FacilityUnitValidationSchema.required({
            units: true
        });

        return updateFacilityUnit.parse(body);
    }

    static getFacilityUnitValidation(body: unknown) {
        const updateFacilityUnit = FacilityUnitValidationSchema.partial({
            unit: true
        }).required({facilityId: true});

        return updateFacilityUnit.parse(body);
    }
}

export default FacilityUnitValidation;
