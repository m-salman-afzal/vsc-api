import {z} from "zod";

import {NUMBER_BOOLEAN_VALUES} from "@appUtils/Constants";

import {booleanValidation, stringValidation} from "./ValidationTypes";

export const InventoryHistoryValidationSchema = z
    .object({
        inventoryHistoryId: stringValidation,
        facilityId: stringValidation,
        fromDate: stringValidation,
        toDate: stringValidation,
        isControlled: booleanValidation.or(z.nativeEnum(NUMBER_BOOLEAN_VALUES))
    })
    .partial();
