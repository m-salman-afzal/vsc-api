import {CentralSupplyLogDrugValidationSchema} from "./Schemas/CentralSupplyLogDrugValidationSchema";

export class CentralSupplyLogDrugValidation {
    static getCentralSupplyLogDrugsValidation(body: unknown) {
        const row = CentralSupplyLogDrugValidationSchema.required({
            centralSupplyLogId: true
        });

        return row.parse(body);
    }
}
