import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const ProcessValidationSchema = z
    .object({
        processId: stringValidation.or(z.array(stringValidation)),
        processName: stringValidation,
        processLabel: stringValidation,
        time: stringValidation,
        type: stringValidation
    })
    .partial();
