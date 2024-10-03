import DivisionValidationSchema from "@validations/Schemas/DivisionValidationSchema";

import {DIVISION_TYPES} from "@appUtils/Constants";

class DivisionValidation {
    static addDivisionValidation(body) {
        const {divisionType} = body;
        const fields = {
            title: true,
            year: true,
            divisionType: true
        };
        if (divisionType === DIVISION_TYPES.JAIL_DIVISION) {
            fields["watch"] = true;
        }
        const addDivisionValidation = DivisionValidationSchema.required({
            ...(fields as object)
        });

        return addDivisionValidation.parse(body);
    }

    static getDivisionValidation(body: unknown) {
        const getDivisionValidation = DivisionValidationSchema.required({
            divisionType: true
        }).partial({
            title: true,
            watch: true,
            year: true,
            facilityId: true
        });

        return getDivisionValidation.parse(body);
    }

    static getDivisionReportValidation(body: unknown) {
        const getDivisionValidation = DivisionValidationSchema.partial({
            facilityId: true,
            divisionType: true,
            dateFrom: true,
            dateTo: true
        });

        return getDivisionValidation.parse(body);
    }
}

export default DivisionValidation;
