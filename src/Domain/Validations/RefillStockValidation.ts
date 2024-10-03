import {FormularyValidationSchema} from "@validations/Schemas/FormularyValidationSchema";

export class RefillStockValidation {
    static refillStockFormularyValidation(body: unknown) {
        const refillStockFormulary = FormularyValidationSchema.required({formularyId: true}).refine(
            (data) => Array.isArray(data.formularyId),
            {message: "formularyId must be an array"}
        );

        return refillStockFormulary.parse(body);
    }
}
