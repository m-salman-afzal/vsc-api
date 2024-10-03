import {z} from "zod";

import {CentralSupplyLogValidationSchema} from "./Schemas/CentralSupplyLogValidationSchema";
import {FormularyValidationSchema} from "./Schemas/FormularyValidationSchema";
import {InventoryValidationSchema} from "./Schemas/InventoryValidationSchema";
import PaginationValidationSchema from "./Schemas/PaginationValidationSchema";

export class CentralSupplyLogValidation {
    static getCentralSupplyDrugsValidation(body: unknown) {
        const row = CentralSupplyLogValidationSchema.merge(FormularyValidationSchema)
            .merge(InventoryValidationSchema)
            .merge(PaginationValidationSchema)
            .partial({
                currentPage: true,
                perPage: true,
                orderedQuantityMax: true,
                orderedQuantityMin: true,
                name: true,
                isControlled: true,
                isFormulary: true,
                facilityId: true,
                isDepleted: true
            });

        return row.parse(body);
    }

    static addCentralSupplyLogValidation(body: unknown) {
        const row = z.object({
            facilityId: z.string().trim().min(1),
            rxOrder: z.array(
                z.object({
                    formularyId: z.string().trim().min(1),
                    orderedQuantity: z.number()
                })
            )
        });

        return row.parse(body);
    }

    static getCentralSupplyLogsValidation(body: unknown) {
        const row = CentralSupplyLogValidationSchema.partial({
            fromDate: true,
            toDate: true,
            text: true,
            orderedQuantityMin: true,
            orderedQuantityMax: true,
            facilityId: true
        });

        return row.parse(body);
    }

    static getMinMaxOrderedQuantityValidation(body: unknown) {
        const row = CentralSupplyLogValidationSchema.required({
            facilityId: true
        });

        return row.parse(body);
    }

    static downloadCentralSupplyLog(body: unknown) {
        const row = CentralSupplyLogValidationSchema.merge(FormularyValidationSchema).partial({
            facilityId: true,
            isControlled: true
        });

        return row.parse(body);
    }
}
