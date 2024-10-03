import {DiscrepancyLogValidationSchema} from "./Schemas/DiscrepancyLogValidationSchema";

export class DiscrepancyLogValidation {
    static getDiscrepancyLogValidation(body: unknown) {
        const row = DiscrepancyLogValidationSchema.required({facilityId: true}).partial({
            fromDate: true,
            toDate: true,
            name: true
        });

        return row.parse(body);
    }
}
