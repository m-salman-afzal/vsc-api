import z from "zod";

import {FacilityChecklistValidationSchema} from "@validations/Schemas/FacilityChecklistValidationSchema";

import PaginationValidationSchema from "./Schemas/PaginationValidationSchema";

export class FacilityChecklistValidation {
    static addFacilityChecklistValidation(body: unknown) {
        const addFacilityChecklist = z
            .object({
                facilityChecklist: z.array(
                    FacilityChecklistValidationSchema.required({event: true}).required({
                        facilityId: true,
                        adminId: true,
                        event: true
                    })
                ),
                facilityId: z.string(),
                externalFacilityId: z.string(),
                supplyDays: z.number()
            })
            .partial()
            .refine(
                ({facilityChecklist, externalFacilityId, supplyDays}) =>
                    facilityChecklist || externalFacilityId || supplyDays,
                {
                    message: "At least one of facilityChecklist, externalFacilityId or supplyDays must be provided"
                }
            );

        return addFacilityChecklist.parse(body);
    }

    static getFacilityChecklistValidation(body: unknown) {
        const addFacilityChecklist = FacilityChecklistValidationSchema.partial({
            event: true,
            adminId: true,
            facilityId: true,
            facilityChecklistId: true
        });

        return addFacilityChecklist.parse(body);
    }

    static getFacilityChecklistSuggestionValidation(body: unknown) {
        const addFacilityChecklist = FacilityChecklistValidationSchema.merge(PaginationValidationSchema)
            .partial({
                event: true,
                adminId: true,
                facilityChecklistId: true
            })
            .required({facilityId: true});

        return addFacilityChecklist.parse(body);
    }
}
