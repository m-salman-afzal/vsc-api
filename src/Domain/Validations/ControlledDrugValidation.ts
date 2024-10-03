import {ControlledDrugValidationSchema} from "./Schemas/ControlledDrugValidationSchema";

export class ControlledDrugValidation {
    static updateControlledDrugValidation(body: unknown) {
        const row = ControlledDrugValidationSchema.required({
            controlledDrugId: true
        })
            .partial({tr: true, controlledId: true, controlledQuantity: true})
            .refine(
                (data) => {
                    if (!data.controlledQuantity) {
                        return true;
                    }

                    return data.controlledQuantity > 0;
                },
                {message: "controlledQuantity should be greater than 0"}
            );

        return row.parse(body);
    }

    static removeControlledDrugValidation(body: unknown) {
        const row = ControlledDrugValidationSchema.required({
            controlledDrugId: true
        });

        return row.parse(body);
    }
}
