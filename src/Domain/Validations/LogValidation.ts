import LogValidationSchema from "@validations/Schemas/LogValidationSchema";
import PaginationValidationSchema from "@validations/Schemas/PaginationValidationSchema";

class LogValidation {
    static getLogReportValidation(body: unknown) {
        const getLogs = LogValidationSchema.merge(PaginationValidationSchema)
            .required({
                currentPage: true,
                perPage: true
            })
            .partial({
                method: true,
                adminId: true,
                fromDate: true,
                toDate: true,
                text: true
            });

        return getLogs.parse(body);
    }
}

export default LogValidation;
