import {
    ADMINISTRATIVE_DIVISION_FILE_PROCESSES,
    FACILITY_FREE_REPOSITORIES,
    REPOSITORY_PROCESSES,
    SHERIFF_DIVISION_FILE_PROCESSES
} from "@constants/FileConstant";

import {FileValidationSchema} from "@validations/Schemas/FileValidationSchema";

import PaginationValidationSchema from "./Schemas/PaginationValidationSchema";

export class FileValidation {
    static addFileValidation(body: unknown) {
        const row = FileValidationSchema.required({
            fileName: true,
            fileExtension: true,
            repository: true,
            process: true,
            fileContent: true
        })
            .partial({
                facilityId: true
            })
            .refine(
                (data) => {
                    return (
                        (typeof data.repository === "string" &&
                            (FACILITY_FREE_REPOSITORIES as string[]).includes(data.repository)) ||
                        (Array.isArray(data.repository) &&
                            data.repository.every((repo) => (FACILITY_FREE_REPOSITORIES as string[]).includes(repo))) ||
                        data.facilityId
                    );
                },
                {message: "facilityId required"}
            )
            .refine(
                (data) => {
                    if (typeof data.repository === "string") {
                        return REPOSITORY_PROCESSES[data.repository].includes(data.process);
                    } else if (Array.isArray(data.repository)) {
                        return data.repository.every((repo) => REPOSITORY_PROCESSES[repo].includes(data.process));
                    }

                    return false;
                },
                {message: "Illegal process against repository"}
            );

        return row.parse(body);
    }

    static getFileValidation(body: unknown) {
        const row = FileValidationSchema.merge(PaginationValidationSchema).partial({
            fileName: true,
            fileExtension: true,
            repository: true,
            process: true,
            status: true,
            isEf: true,
            adminId: true,
            facilityId: true,
            currentPage: true,
            perPage: true,
            fromDate: true,
            toDate: true
        });

        return row.parse(body);
    }

    static addDivisionStatsFileValidation(body: unknown) {
        const row = FileValidationSchema.required({
            fileName: true,
            fileExtension: true,
            process: true,
            fileContent: true
        }).refine((data) => SHERIFF_DIVISION_FILE_PROCESSES[data.process], {
            message: "Illegal process against repository"
        });

        return row.parse(body);
    }

    static addAdministrativeFileValidation(body: unknown) {
        const row = FileValidationSchema.required({
            fileName: true,
            fileExtension: true,
            process: true,
            fileContent: true
        }).refine((data) => ADMINISTRATIVE_DIVISION_FILE_PROCESSES[data.process], {
            message: "Illegal process against repository"
        });

        return row.parse(body);
    }

    static downloadFileValidation(body: unknown) {
        const row = FileValidationSchema.required({
            fileId: true
        }).partial({isEf: true});

        return row.parse(body);
    }
}
