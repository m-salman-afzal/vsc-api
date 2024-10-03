import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const FacilityContactValidationSchema = z
    .object({
        facilityContactId: stringValidation,
        contactId: stringValidation,
        facilityId: stringValidation
    })
    .partial();
