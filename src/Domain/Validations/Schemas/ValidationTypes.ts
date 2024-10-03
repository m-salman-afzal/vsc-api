import {z} from "zod";

import {BOOLEAN_VALUES} from "@appUtils/Constants";

export const stringValidation = z.string().trim().min(1);

export const booleanValidation = z.boolean().or(z.nativeEnum(BOOLEAN_VALUES));
