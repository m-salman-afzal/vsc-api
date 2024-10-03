import {HistoryPhysicalValidationSchema} from "@validations/Schemas/HistoryPhysicalValidationSchema";

export class HistoryPhysicalValidation {
    static getHistoryPhysical(body: unknown) {
        const getHistoryPhysical = HistoryPhysicalValidationSchema.required({
            isYearly: true,
            facilityId: true
        }).partial({
            to: true,
            from: true
        });

        return getHistoryPhysical.parse(body);
    }
}
