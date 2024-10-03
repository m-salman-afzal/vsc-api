import {z} from "zod";

import {FILE_EXTENSIONS, FILE_STATUSES, REPOSITORIES} from "@constants/FileConstant";

import {booleanValidation, stringValidation} from "./ValidationTypes";

export const FileValidationSchema = z
    .object({
        fileId: stringValidation,
        fileName: stringValidation,
        fileExtension: z.nativeEnum(FILE_EXTENSIONS),
        repository: z.nativeEnum(REPOSITORIES).or(z.array(z.nativeEnum(REPOSITORIES))),
        process: z.string(),
        status: z.nativeEnum(FILE_STATUSES),
        isEf: booleanValidation,
        adminId: stringValidation,
        fileContent: stringValidation,
        facilityId: z.array(stringValidation).or(stringValidation),
        fromDate: stringValidation,
        toDate: stringValidation
    })
    .partial();
