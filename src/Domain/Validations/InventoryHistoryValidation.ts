import {InventoryHistoryValidationSchema} from "./Schemas/InventoryHistoryValidationSchema";

export class InventoryHistoryValidation {
    static getInventoryHistoryList(body: unknown) {
        const row = InventoryHistoryValidationSchema.required({
            facilityId: true
        }).partial({
            fromDate: true,
            toDate: true
        });

        return row.parse(body);
    }

    static downloadInventoryHistory(body: unknown) {
        const row = InventoryHistoryValidationSchema.required({
            inventoryHistoryId: true
        }).partial({isControlled: true});

        return row.parse(body);
    }
}
