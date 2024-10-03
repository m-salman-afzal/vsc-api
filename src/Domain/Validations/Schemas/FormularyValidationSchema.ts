import {z} from "zod";

import {DRUG_TYPES, PACKAGE, RELEASE} from "@constants/FormularyConstant";

import {NUMBER_BOOLEAN_VALUES} from "@appUtils/Constants";

import {booleanValidation, stringValidation} from "./ValidationTypes";

export const FormularyValidationSchema = z
    .object({
        id: z.number(),
        formularyId: stringValidation.or(z.array(stringValidation)),
        brandName: stringValidation,
        genericName: stringValidation,
        drugName: z.nativeEnum(DRUG_TYPES),
        strengthUnit: stringValidation,
        formulation: stringValidation,
        release: z.nativeEnum(RELEASE),
        package: z.nativeEnum(PACKAGE),
        isGeneric: booleanValidation,
        drugClass: stringValidation,
        isActive: booleanValidation.or(z.nativeEnum({NONE: "none"})),
        name: stringValidation,
        refillStock: booleanValidation.or(z.nativeEnum(NUMBER_BOOLEAN_VALUES)),
        isControlled: booleanValidation.or(z.nativeEnum(NUMBER_BOOLEAN_VALUES)),
        isFormulary: booleanValidation.or(z.nativeEnum(NUMBER_BOOLEAN_VALUES)),
        unitsPkg: z.number(),
        min: z.number(),
        max: z.number(),
        parLevel: z.number(),
        threshold: z.number(),
        drug: stringValidation,
        formularyAutoId: z.number()
    })
    .partial();
