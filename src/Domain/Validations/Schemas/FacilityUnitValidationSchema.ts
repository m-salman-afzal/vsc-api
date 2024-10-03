import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const FacilityUnitValidationSchema = z
    .object({
        facilityUnitId: stringValidation,
        facilityId: stringValidation,
        unit: z.string(),
        cell: z.string(),
        bed: z.string(),
        isHnP: z.number(),
        isCart: z.number(),
        quantity: z.number(),
        drugCount: z.number(),
        patientCount: z.number(),
        units: z.array(
            z.object({
                facilityUnitId: stringValidation,
                isHnP: z.number(),
                isCart: z.number()
            })
        )
    })
    .partial();
