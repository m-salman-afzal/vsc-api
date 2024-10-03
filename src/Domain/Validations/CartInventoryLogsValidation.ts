import {CartInventoryLogsSchema} from "./Schemas/CartInventoryLogsValidationSchema";

export class CartInventoryLogsValidation {
    static addCartInventoryLogs(body: unknown) {
        const row = CartInventoryLogsSchema.required({
            cartId: true,
            facilityId: true,
            comment: true,
            witnessName: true,
            countedBy: true,
            countedBySignature: true,
            witnessSignature: true
        });

        return row.parse(body);
    }

    static getCartInventoryLogs(body: unknown) {
        const row = CartInventoryLogsSchema.required({
            facilityId: true
        }).partial({
            fromDate: true,
            toDate: true,
            cartId: true
        });

        return row.parse(body);
    }
    static getCarts(body: unknown) {
        const row = CartInventoryLogsSchema.required({
            facilityId: true
        });

        return row.parse(body);
    }
}
