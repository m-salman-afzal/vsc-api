import {z} from "zod";

const stringValidation = z.string().trim().min(1, {message: "String required"});

export const CartInventoryLogsDrugSchema = z
    .object({
        cartInventoryLogsId: stringValidation
    })
    .partial();
