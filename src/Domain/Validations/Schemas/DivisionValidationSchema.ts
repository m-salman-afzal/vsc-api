import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

const DivisionValidationObject = z
    .object({
        divisionId: stringValidation,
        title: stringValidation,
        year: stringValidation,
        watch: stringValidation,
        divisionType: stringValidation,
        isBold: z.coerce.boolean(),
        facilityId: z.string(),
        dateFrom: z.string(),
        dateTo: z.string()
    })
    .partial();

export default DivisionValidationObject;
