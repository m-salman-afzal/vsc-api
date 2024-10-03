import {z} from "zod";

import {DATE_VALIDATION, MDY_DATE_VALIDATION, TIME_VALIDATION} from "@constants/RegexConstant";

import {stringValidation} from "./ValidationTypes";

const ServiceDisruptionValidationObject = z
    .object({
        serviceDisruptionId: stringValidation,
        date: z.string().regex(MDY_DATE_VALIDATION).or(z.string().regex(DATE_VALIDATION)),
        time: z.string().regex(TIME_VALIDATION),
        service: stringValidation,
        reason: stringValidation,
        facilityId: stringValidation,
        adminId: stringValidation
    })
    .partial();

export default ServiceDisruptionValidationObject;
