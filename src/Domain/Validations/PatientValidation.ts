import {PatientValidationSchema} from "@validations/Schemas/PatientValidationSchema";

import PaginationValidationSchema from "./Schemas/PaginationValidationSchema";

export class PatientValidation {
    static addPatientValidation(body: unknown) {
        const addpatient = PatientValidationSchema.required({
            externalPatientId: true,
            jmsId: true,
            name: true,
            location: true,
            dob: true,
            gender: true,
            status: true,
            lastBookedDate: true
        }).partial({lastReleaseDate: true});

        return addpatient.parse(body);
    }

    static getPatientValidation(body: unknown) {
        const getPatient = PatientValidationSchema.merge(PaginationValidationSchema)
            .required({facilityId: true})
            .partial({
                currentPage: true,
                perPage: true,
                searchText: true,
                status: true,
                toDate: true,
                fromDate: true
            });

        return getPatient.parse(body);
    }
}
