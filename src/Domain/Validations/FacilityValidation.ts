import {FacilityValidationSchema} from "@validations/Schemas/FacilityValidationSchema";

export class FacilityValidation {
    static addFacilityValidation(body: unknown) {
        const addFacility = FacilityValidationSchema.required({
            facilityName: true,
            address: true
        }).partial({population: true, launchDate: true});

        return addFacility.parse(body);
    }

    static getFacilityValidation(body: unknown) {
        const getFacility = FacilityValidationSchema.partial({
            facilityId: true,
            text: true
        });

        return getFacility.parse(body);
    }

    static updateFacilityValidation(body: unknown) {
        const updateFacility = FacilityValidationSchema.required({
            facilityId: true
        }).partial({
            facilityName: true,
            externalFacilityId: true,
            address: true,
            population: true,
            launchDate: true
        });

        return updateFacility.parse(body);
    }

    static removeFacilityValidation(body: unknown) {
        const removeFacility = FacilityValidationSchema.required({
            facilityId: true
        });

        return removeFacility.parse(body);
    }
}
