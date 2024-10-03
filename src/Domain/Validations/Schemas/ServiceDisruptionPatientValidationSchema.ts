import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

const ServiceDisruptionPatientValidationObject = z
    .object({
        serviceDisruptionPatientId: stringValidation,
        patientName: z.string().trim(),
        patientNumber: z.string().trim(),
        time: z.string().trim(),
        comments: z.string().trim(),
        delayPeriod: z.string().trim(),
        serviceDisruptionId: stringValidation
    })
    .partial();

export default ServiceDisruptionPatientValidationObject;
