import {z} from "zod";

const stringValidation = z.string().trim().min(1, {message: "String required"});

export const CartInventoryLogsSchema = z
    .object({
        cartId: stringValidation,
        facilityId: stringValidation,
        fromDate: stringValidation,
        toDate: stringValidation,
        countedBy: stringValidation,
        witnessName: stringValidation,
        witnessSignature: stringValidation,
        countedBySignature: stringValidation,
        comment: stringValidation
    })
    .partial();
