import {DiscrepancyLogValidationSchema} from "./Schemas/DiscrepancyLogValidationSchema";
import {PerpetualInventoryDeductionValidationSchema} from "./Schemas/PerpetualInventoryDeductionValidationSchema";

export class PerpetualInventoryDeductionValidaton {
    static removePerpInvDeductionValidation(body: unknown) {
        const rows = DiscrepancyLogValidationSchema.required({
            facilityId: true,
            adminId: true,
            level: true,
            type: true,
            perpetualInventoryDeductionId: true,
            comment: true
        });

        return rows.parse(body);
    }

    static updatePerpInvDeductionValidation(body: unknown) {
        const rows = PerpetualInventoryDeductionValidationSchema.merge(DiscrepancyLogValidationSchema)
            .required({
                facilityId: true,
                adminId: true,
                level: true,
                type: true,
                perpetualInventoryDeductionId: true,
                comment: true,
                date: true,
                time: true,
                quantityDeducted: true
            })
            .partial({
                providerName: true,
                patientName: true
            });

        return rows.parse(body);
    }
}
