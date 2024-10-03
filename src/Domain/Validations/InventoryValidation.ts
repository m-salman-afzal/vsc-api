import {InventoryValidationSchema} from "@validations/Schemas/InventoryValidationSchema";

import {ControlledDrugValidationSchema} from "./Schemas/ControlledDrugValidationSchema";
import {FacilityValidationSchema} from "./Schemas/FacilityValidationSchema";
import {FormularyLevelValidationSchema} from "./Schemas/FormularyLevelValidationSchema";
import {FormularyValidationSchema} from "./Schemas/FormularyValidationSchema";
import {InventoryControlValidationSchema} from "./Schemas/InventoryControlValidationSchema";
import PaginationValidationSchema from "./Schemas/PaginationValidationSchema";

export class InventoryValidation {
    static addInventoryValidation(body: unknown) {
        const row = InventoryValidationSchema.merge(InventoryControlValidationSchema)
            .merge(FormularyLevelValidationSchema)
            .merge(FormularyValidationSchema)
            .required({
                ndc: true,
                manufacturer: true,
                lotNo: true,
                expirationDate: true,
                quantity: true,
                formularyId: true,
                facilityId: true
            })
            .partial({
                controlledId: true,
                receiverName: true,
                witnessName: true,
                signature: true,
                min: true,
                max: true,
                threshold: true,
                parLevel: true
            })
            .refine(
                (data) => {
                    if (data.min && data.max) {
                        return data.min < data.max;
                    }

                    return true;
                },
                {message: "min should be less than max"}
            )
            .refine(
                (data) => {
                    if (data.parLevel && data.threshold) {
                        return data.parLevel > data.threshold;
                    }

                    return true;
                },
                {message: "parLevel should be more than threshold"}
            )
            .refine(
                (data) => {
                    if (data.controlledId) {
                        return data.receiverName && data.witnessName && data.signature;
                    }

                    return true;
                },
                {message: "Controlled inventory requires receiverName, witnessName and signature"}
            );

        return row.parse(body);
    }

    static getInventoryValidation(body: unknown) {
        const row = InventoryValidationSchema.merge(FormularyValidationSchema)
            .merge(PaginationValidationSchema)
            .merge(FacilityValidationSchema)
            .required({facilityId: true})
            .partial({
                perPage: true,
                currentPage: true,
                name: true,
                isActive: true,
                isPendingOrder: true,
                isDepleted: true,
                isControlled: true,
                isFormulary: true
            });

        return row.parse(body);
    }

    static updateInventoryValidation(body: unknown) {
        const row = InventoryValidationSchema.required({
            inventoryId: true
        }).partial({
            ndc: true,
            manufacturer: true,
            isActive: true,
            formularyId: true,
            controlledId: true,
            lotNo: true,
            expirationDate: true,
            quantity: true
        });

        return row.parse(body);
    }

    static removeInventoryValidation(body: unknown) {
        const row = InventoryValidationSchema.required({
            inventoryId: true
        });

        return row.parse(body);
    }

    static getInventorySuggestionValidation(body: unknown) {
        const row = InventoryValidationSchema.merge(FormularyValidationSchema).required({formularyId: true});

        return row.parse(body);
    }

    static getAllInventoryValidation(body: unknown) {
        const row = InventoryValidationSchema.merge(FacilityValidationSchema).required({facilityId: true});

        return row.parse(body);
    }

    static getControlledIdsValidation(body: unknown) {
        const row = InventoryValidationSchema.merge(FacilityValidationSchema).required({
            facilityId: true,
            formularyId: true
        });

        return row.parse(body);
    }

    static bulkAddNonControlledInventoryValidation(body: unknown) {
        const row = InventoryValidationSchema.required({
            formularyAutoId: true,
            facilityId: true,
            drug: true,
            manufacturer: true,
            lotNo: true,
            expirationDate: true,
            ndc: true,
            action: true,
            quantity: true
        });

        return row.parse(body);
    }

    static bulkEditNonControlledInventoryValidation(body: unknown) {
        const row = InventoryValidationSchema.required({
            facilityId: true,
            formularyAutoId: true,
            inventoryAutoId: true,
            drug: true,
            action: true,
            ndc: true,
            lotNo: true,
            manufacturer: true,
            expirationDate: true,
            quantity: true
        });

        return row.parse(body);
    }

    static bulkRemoveNonControlledInventoryValidation(body: unknown) {
        const row = InventoryValidationSchema.required({
            facilityId: true,
            formularyAutoId: true,
            inventoryAutoId: true,
            drug: true,
            ndc: true,
            manufacturer: true,
            expirationDate: true,
            action: true
        });

        return row.parse(body);
    }

    static bulkAddControlledInventoryValidation(body: unknown) {
        const row = InventoryValidationSchema.merge(ControlledDrugValidationSchema)
            .required({
                formularyAutoId: true,
                facilityId: true,
                drug: true,
                manufacturer: true,
                lotNo: true,
                expirationDate: true,
                ndc: true,
                action: true,
                controlledQuantity: true,
                controlledId: true
            })
            .partial({
                tr: true
            });

        return row.parse(body);
    }

    static bulkEditControlledInventoryValidation(body: unknown) {
        const row = InventoryValidationSchema.merge(ControlledDrugValidationSchema)
            .required({
                formularyAutoId: true,
                facilityId: true,
                drug: true,
                manufacturer: true,
                lotNo: true,
                expirationDate: true,
                ndc: true,
                action: true,
                controlledQuantity: true,
                controlledId: true,
                controlledDrugAutoId: true,
                inventoryAutoId: true
            })
            .partial({
                tr: true
            });

        return row.parse(body);
    }

    static bulkRemoveControlledInventoryValidation(body: unknown) {
        const row = InventoryValidationSchema.merge(ControlledDrugValidationSchema).required({
            facilityId: true,
            formularyAutoId: true,
            inventoryAutoId: true,
            drug: true,
            ndc: true,
            controlledId: true,
            manufacturer: true,
            expirationDate: true,
            controlledDrugAutoId: true
        });

        return row.parse(body);
    }
}
