import {z} from "zod";

const stringValidation = z.string().trim().min(1, {message: "String required"});

export const CentralSupplyLogDrugValidationSchema = z
    .object({
        centralSupplyLogDrugId: stringValidation,
        orderedQuantity: z.number().or(stringValidation),
        formularyQuantity: z.number(),
        centralSupplyLogId: stringValidation,
        formularyId: stringValidation
    })
    .partial();
