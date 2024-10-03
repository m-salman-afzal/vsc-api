import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const ReferenceGuideValidationSchema = z
    .object({
        referenceGuideId: stringValidation,
        facilityId: stringValidation,
        name: stringValidation,
        note: stringValidation
    })
    .partial();
