import PaginationValidationSchema from "./Schemas/PaginationValidationSchema";
import {ShiftCountLogValidationSchema} from "./Schemas/ShiftCountLogValidationSchema";

export class ShiftCountLogValidation {
    static getShiftCountLogsValidation(body: unknown) {
        const getShiftCountLogs = ShiftCountLogValidationSchema.merge(PaginationValidationSchema)
            .required({facilityId: true})
            .partial({
                currentPage: true,
                perPage: true,
                cartId: true,
                fromDate: true,
                toDate: true,
                searchText: true
            });

        return getShiftCountLogs.parse(body);
    }

    static addShiftCountLogsValidation(body: unknown) {
        const addShiftCountLogs = ShiftCountLogValidationSchema.required({
            facilityId: true,
            cartId: true,
            handOffName: true,
            receiverName: true,
            handOffSignature: true,
            receiverSignature: true,
            shiftCountLogDrugs: true,
            isDiscrepancy: true,
            comment: true
        });

        return addShiftCountLogs.parse(body);
    }
}
