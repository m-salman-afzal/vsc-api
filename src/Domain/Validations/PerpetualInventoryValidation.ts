import z from "zod";

import {DiscrepancyLogValidationSchema} from "./Schemas/DiscrepancyLogValidationSchema";
import PaginationValidationSchema from "./Schemas/PaginationValidationSchema";
import {PerpetualInventoryDeductionValidationSchema} from "./Schemas/PerpetualInventoryDeductionValidationSchema";
import {PerpetualInventoryValidationSchema} from "./Schemas/PerpetualInventoryValidationSchema";
import {stringValidation} from "./Schemas/ValidationTypes";

export class PerpetualInventoryValidaton {
    static getPerpetualInventoryValidation(body: unknown) {
        const getPI = PerpetualInventoryValidationSchema.merge(PaginationValidationSchema)
            .required({facilityId: true})
            .partial({
                currentPage: true,
                perPage: true,
                text: true,
                cartId: true
            });

        return getPI.parse(body);
    }

    static updatePerpetualInventoryValidation(body: unknown) {
        const updatePI = PerpetualInventoryValidationSchema.merge(DiscrepancyLogValidationSchema)
            .required({
                perpetualInventoryId: true,
                controlledId: true,
                quantityAllocated: true,
                comment: true,
                adminId: true
            })
            .partial({
                tr: true,
                rx: true,
                providerName: true,
                patientName: true
            });

        return updatePI.parse(body);
    }
    static unarchivePerpetualInventoryValidation(body: unknown) {
        const updatePI = PerpetualInventoryValidationSchema.required({
            perpetualInventoryId: true
        });

        return updatePI.parse(body);
    }
    static removePerpetualInventoryValidation(body: unknown) {
        const removePI = PerpetualInventoryValidationSchema.required({
            perpetualInventoryId: true,
            comment: true
        });

        return removePI.parse(body);
    }

    static addStaffSignatureValidation(body: unknown) {
        const addSign = PerpetualInventoryValidationSchema.required({
            perpetualInventoryId: true,
            staffName: true,
            staffSignature: true
        });

        return addSign.parse(body);
    }
    static addPerpetualInventoryDeductionValidation(body: unknown) {
        const addPID = PerpetualInventoryDeductionValidationSchema.merge(PerpetualInventoryValidationSchema)
            .merge(
                z.object({
                    signatureImages: z.object({
                        adminSignature: stringValidation,
                        witnessSignature: stringValidation,
                        nurseSignature: stringValidation.optional()
                    })
                })
            )
            .required({
                perpetualInventoryId: true,
                signatureImages: true,
                date: true,
                time: true,
                type: true,
                quantityDeducted: true
            })
            .partial({
                patientName: true,
                providerName: true,
                comment: true,
                cartId: true
            });

        return addPID.parse(body);
    }

    static getPerpetualInventorySignatureValidation(body: unknown) {
        const getSign = PerpetualInventoryDeductionValidationSchema.merge(PerpetualInventoryValidationSchema)
            .required({facilityId: true})
            .partial({signatureType: true})
            .refine(
                ({perpetualInventoryId, perpetualInventoryDeductionId}) =>
                    perpetualInventoryId || perpetualInventoryDeductionId,
                {message: "One of perpetualInventoryId || perpetualInventoryDeductionId is required "}
            );

        return getSign.parse(body);
    }

    static getCartsValidation(body: unknown) {
        const getCarts = PerpetualInventoryValidationSchema.required({
            facilityId: true
        });

        return getCarts.parse(body);
    }
}
