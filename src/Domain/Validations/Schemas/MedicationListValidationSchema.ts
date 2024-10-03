import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const MedicationListValidationSchema = z
    .object({
        facilityId: stringValidation,
        medicationListId: stringValidation,
        dateFrom: stringValidation,
        dateTo: stringValidation
    })
    .partial();
