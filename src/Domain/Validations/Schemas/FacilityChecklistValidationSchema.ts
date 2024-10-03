import {z} from "zod";

import {FACILITY_CHECKLIST_EVENTS} from "@constants/FacilityChecklistConstant";

import {stringValidation} from "./ValidationTypes";

export const FacilityChecklistValidationSchema = z
    .object({
        event: z.nativeEnum(FACILITY_CHECKLIST_EVENTS),
        facilityChecklistId: stringValidation,
        adminId: stringValidation,
        facilityId: stringValidation
    })
    .partial();
