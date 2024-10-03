import {ReferenceGuideDrugValidationSchema} from "@validations/Schemas/ReferenceGuideDrugValidationSchema";

export class ReferenceGuideDrugValidation {
    static getReferenceGuideDrugValidation(body: unknown) {
        const getReferenceGuideDrug = ReferenceGuideDrugValidationSchema.required({
            referenceGuideId: true
        });

        return getReferenceGuideDrug.parse(body);
    }

    static exportReferenceGuideDrugValidation(body: unknown) {
        const exportReferenceGuideDrug = ReferenceGuideDrugValidationSchema.required({
            referenceGuideId: true
        });

        return exportReferenceGuideDrug.parse(body);
    }

    static addReferenceGuideDrugValidation(body: unknown) {
        const addReferenceGuideDrug = ReferenceGuideDrugValidationSchema.required({
            id: true,
            formularyId: true,
            drug: true,
            referenceGuideId: true,
            category: true,
            min: true,
            max: true
        });

        return addReferenceGuideDrug.parse(body);
    }

    static updateReferenceGuideDrugValidation(body: unknown) {
        const updateReferenceGuideDrug = ReferenceGuideDrugValidationSchema.required({
            referenceGuideId: true,
            formularyId: true,
            drug: true,
            category: true,
            min: true,
            max: true
        });

        return updateReferenceGuideDrug.parse(body);
    }

    static removeReferenceGuideDrugValidation(body: unknown) {
        const removeReferenceGuideDrug = ReferenceGuideDrugValidationSchema.required({
            formularyId: true,
            drug: true,
            referenceGuideId: true
        });

        return removeReferenceGuideDrug.parse(body);
    }
}
