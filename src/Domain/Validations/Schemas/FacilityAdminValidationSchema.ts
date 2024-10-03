import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const FacilityAdminValidationSchema = z
    .object({
        facilityAdminId: stringValidation,
        adminId: stringValidation,
        facilityId: stringValidation
    })
    .partial();
