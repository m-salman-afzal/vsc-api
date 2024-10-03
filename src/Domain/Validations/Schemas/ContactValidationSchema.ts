import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const ContactValidationSchema = z
    .object({
        contactId: stringValidation,
        firstName: stringValidation,
        lastName: stringValidation,
        email: z.string().email(),
        type: stringValidation,
        searchText: stringValidation
    })
    .partial();
