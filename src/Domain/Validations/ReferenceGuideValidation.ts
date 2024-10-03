import {ReferenceGuideValidationSchema} from "@validations/Schemas/ReferenceGuideValidationSchema";

export class ReferenceGuideValidation {
    static getReferenceGuideValidation(body: unknown) {
        const getReferenceGuide = ReferenceGuideValidationSchema.required({
            facilityId: true
        });

        return getReferenceGuide.parse(body);
    }

    static addReferenceGuideValidation(body: unknown) {
        const addReferenceGuide = ReferenceGuideValidationSchema.required({
            name: true,
            facilityId: true
        });

        return addReferenceGuide.parse(body);
    }

    static modifyReferenceGuideValidation(body: unknown) {
        const modifyReferenceGuide = ReferenceGuideValidationSchema.required({
            referenceGuideId: true,
            facilityId: true
        });

        return modifyReferenceGuide.parse(body);
    }

    static updateReferenceGuideValidation(body: unknown) {
        const updateReferenceGuide = ReferenceGuideValidationSchema.required({
            referenceGuideId: true,
            name: true
        });

        return updateReferenceGuide.parse(body);
    }

    static removeReferenceGuideValidation(body: unknown) {
        const removeReferenceGuide = ReferenceGuideValidationSchema.required({
            referenceGuideId: true,
            facilityId: true
        });

        return removeReferenceGuide.parse(body);
    }

    static setReferenceGuideNoteValidation(body: unknown) {
        const referenceGuideNote = ReferenceGuideValidationSchema.required({
            referenceGuideId: true,
            facilityId: true,
            note: true
        });

        return referenceGuideNote.parse(body);
    }
}
