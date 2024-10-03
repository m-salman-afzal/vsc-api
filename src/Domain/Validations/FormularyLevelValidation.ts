import {FormularyValidationSchema} from "@validations/Schemas/FormularyValidationSchema";

import {FacilityValidationSchema} from "./Schemas/FacilityValidationSchema";
import {FormularyLevelValidationSchema} from "./Schemas/FormularyLevelValidationSchema";

export class FormularyLevelValidation {
    static upsertFormularyLevelValidation(body: unknown) {
        const row = FormularyLevelValidationSchema.merge(FacilityValidationSchema)
            .merge(FormularyValidationSchema)
            .partial({
                min: true,
                max: true,
                threshold: true,
                parLevel: true,
                facilityId: true,
                formularyId: true,
                isStock: true
            });

        return row.parse(body);
    }

    static bulkFormularyLevelValidation(body: unknown) {
        const row = FormularyLevelValidationSchema.merge(FacilityValidationSchema)
            .merge(FormularyValidationSchema)
            .required({
                min: true,
                max: true,
                threshold: true,
                parLevel: true,
                facilityId: true,
                formularyAutoId: true,
                drug: true,
                isCentralSupply: true
            })
            .refine(
                (data) => {
                    if (data.min && data.max) {
                        return data.min < data.max;
                    }

                    return true;
                },
                {message: "min should be less than max"}
            )
            .refine(
                (data) => {
                    if (data.parLevel && data.threshold) {
                        return data.parLevel > data.threshold;
                    }

                    return true;
                },
                {message: "parLevel should be more than threshold"}
            );

        return row.parse(body);
    }
}
