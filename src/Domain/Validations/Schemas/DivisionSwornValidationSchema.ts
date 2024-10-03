import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

const DivisionSwornValidationObject = z
    .object({
        divisionSwornId: stringValidation,
        title: stringValidation,
        year: stringValidation,
        category: stringValidation,
        facilityId: z.string(),
        dateFrom: z.string(),
        dateTo: z.string()
    })
    .partial();

export default DivisionSwornValidationObject;
