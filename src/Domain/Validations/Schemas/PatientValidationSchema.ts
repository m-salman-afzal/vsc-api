import {z} from "zod";

import {PATIENT_STATUS} from "@constants/PatientConstant";
import {DATE_VALIDATION} from "@constants/RegexConstant";

import {stringValidation} from "./ValidationTypes";

export const PatientValidationSchema = z
    .object({
        patientId: stringValidation.or(z.array(stringValidation)),
        adminId: stringValidation,
        searchText: stringValidation,
        externalPatientId: stringValidation,
        jmsId: stringValidation,
        name: stringValidation,
        location: stringValidation,
        dob: stringValidation,
        gender: stringValidation,
        status: z.enum(PATIENT_STATUS),
        lastBookedDate: stringValidation.or(z.date()),
        lastReleaseDate: stringValidation,
        facilityId: stringValidation,
        toDate: z.string().regex(DATE_VALIDATION),
        fromDate: z.string().regex(DATE_VALIDATION)
    })
    .partial();
