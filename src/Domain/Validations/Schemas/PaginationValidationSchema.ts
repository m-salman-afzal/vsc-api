import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

const PaginationValidationSchema = z
    .object({
        currentPage: stringValidation,
        perPage: stringValidation
    })
    .partial();

export default PaginationValidationSchema;
