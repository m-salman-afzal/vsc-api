import {CartInventoryLogsDrugSchema} from "./Schemas/CartInventoryLogsDrugSchema";

export class CartInventoryLogsDrugValidation {
    static getCartInventoryLogs(body: unknown) {
        const row = CartInventoryLogsDrugSchema.required({
            cartInventoryLogsId: true
        });

        return row.parse(body);
    }
}
