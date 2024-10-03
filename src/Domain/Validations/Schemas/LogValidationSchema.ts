import {z} from "zod";

import {IMAGE_VALIDATION} from "@constants/RegexConstant";

import {REQUEST_METHODS} from "@appUtils/Constants";

import {stringValidation} from "./ValidationTypes";

const LogValidationSchema = z
    .object({
        method: z.nativeEnum(REQUEST_METHODS),
        toDate: z.string().regex(IMAGE_VALIDATION),
        fromDate: z.string().regex(IMAGE_VALIDATION),
        adminId: stringValidation,
        text: stringValidation
    })
    .partial();

export default LogValidationSchema;
