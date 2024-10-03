import DivisionSwornValidationSchema from "@validations/Schemas/DivisionSwornValidationSchema";

class DivisionSwornValidation {
    static getDivisionSwornValidation(body: unknown) {
        const getDivisionSwornValidation = DivisionSwornValidationSchema.required({
            year: true
        }).partial({
            title: true,
            category: true,
            facilityId: true
        });

        return getDivisionSwornValidation.parse(body);
    }

    static addDivisionSwornValidation(body) {
        const addDivisionSwornValidation = DivisionSwornValidationSchema.required({
            title: true,
            year: true,
            category: true
        });

        return addDivisionSwornValidation.parse(body);
    }
}

export default DivisionSwornValidation;
