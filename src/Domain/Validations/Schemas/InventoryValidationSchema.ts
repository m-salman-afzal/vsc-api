import {z} from "zod";

import {DATE_VALIDATION, MDY_DATE_VALIDATION} from "@constants/RegexConstant";

import {NUMBER_BOOLEAN_VALUES} from "@appUtils/Constants";

import {booleanValidation, stringValidation} from "./ValidationTypes";

export const InventoryValidationSchema = z
    .object({
        id: z.number(),
        inventoryId: stringValidation,
        ndc: stringValidation,
        manufacturer: stringValidation,
        isActive: booleanValidation.or(z.nativeEnum({NONE: "none"})),
        controlledId: stringValidation,
        lotNo: stringValidation,
        expirationDate: z.string().regex(MDY_DATE_VALIDATION).or(z.string().regex(DATE_VALIDATION)),
        quantity: z.number(),
        isPendingOrder: booleanValidation,
        isDepleted: booleanValidation,
        facilityId: stringValidation,
        formularyId: stringValidation,
        inventoryAutoId: z.number(),
        formularyAutoId: z.number(),
        isControlled: booleanValidation.or(z.nativeEnum(NUMBER_BOOLEAN_VALUES)),
        isFormulary: booleanValidation.or(z.nativeEnum(NUMBER_BOOLEAN_VALUES)),
        drug: stringValidation,
        action: stringValidation
    })
    .partial();
