import PaginationValidationSchema from "@domain/Validations/Schemas/PaginationValidationSchema";

import {AuditLogSearchValidationSchema, AuditLogValidationSchema} from "./Schemas/AuditLogValidationSchema";

export class AuditLogValidation {
    static getAuditLogValidation(body: unknown) {
        const auditLog = AuditLogValidationSchema.merge(PaginationValidationSchema).partial({
            action: true,
            entityId: true,
            text: true,
            toDate: true,
            fromDate: true,
            currentPage: true,
            perPage: true,
            sort: true
        });

        return auditLog.parse(body);
    }

    static searchAuditLogsValidation(body: unknown) {
        const validation = AuditLogSearchValidationSchema.merge(PaginationValidationSchema)
            .required({text: true})
            .partial({
                currentPage: true,
                perPage: true
            });

        return validation.parse(body);
    }
}
