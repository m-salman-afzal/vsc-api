import z from "zod";

import {CART_REQUEST_TYPE} from "@constants/CartRequestConstant";

import {BOOLEAN_VALUES} from "@appUtils/Constants";

import {CartRequestDrugValidationSchema} from "./Schemas/CartRequestDrugValidationSchema";
import {CartRequestLogValidationSchema} from "./Schemas/CartRequestLogValidationSchema";
import {CartValidationSchema} from "./Schemas/CartValidationSchema";
import {FormularyValidationSchema} from "./Schemas/FormularyValidationSchema";
import PaginationValidationSchema from "./Schemas/PaginationValidationSchema";
import {stringValidation} from "./Schemas/ValidationTypes";

export class CartRequestDrugValidation {
    static GetCartRequestDrugsValidation(body: unknown) {
        const row = CartRequestDrugValidationSchema.merge(PaginationValidationSchema)
            .merge(
                z.object({
                    isRequestLog: z.nativeEnum(BOOLEAN_VALUES),
                    cartRequestLogType: z.nativeEnum(CART_REQUEST_TYPE)
                })
            )
            .required({isRequestLog: true})
            .partial({
                cartRequestLogId: true,
                cartRequestAllocationLogId: true,
                cartRequestPickLogId: true,
                cartRequestDeletionLogId: true,
                currentPage: true,
                perPage: true,
                cartRequestLogType: true
            });

        return row.parse(body);
    }

    static getCartPickValidation(body: unknown) {
        const row = FormularyValidationSchema.merge(PaginationValidationSchema)
            .merge(CartRequestDrugValidationSchema)
            .required({
                pickStatus: true,
                facilityId: true
            })
            .partial({
                name: true,
                currentPage: true,
                perPage: true,
                allocationStatus: true
            });

        return row.parse(body);
    }

    static updateCartPickValidation(body: unknown) {
        const row = CartRequestDrugValidationSchema.required({
            pickStatus: true,
            allocationStatus: true
        })
            .partial({
                formularyId: true
            })
            .refine((data) => Array.isArray(data.formularyId), {
                message: "formularyId must be an array"
            });

        return row.parse(body);
    }

    static getCartAllocationValidation(body: unknown) {
        const row = FormularyValidationSchema.merge(PaginationValidationSchema)
            .merge(CartRequestDrugValidationSchema)
            .merge(CartRequestLogValidationSchema)
            .required({
                pickStatus: true,
                allocationStatus: true,
                facilityId: true
            })
            .partial({
                name: true,
                currentPage: true,
                perPage: true,
                cartId: true,
                allocatedByAdminId: true,
                type: true
            });

        return row.parse(body);
    }

    static upsertCartAllocationValidation(body: unknown) {
        const row = CartRequestLogValidationSchema.merge(CartRequestDrugValidationSchema)
            .merge(
                z.object({
                    signatureImages: z.object({
                        receiverSignatureImage: stringValidation,
                        witnessSignatureImage: stringValidation
                    })
                })
            )
            .required({
                cartRequestDrugId: true,
                type: true,
                allocationStatus: true,
                facilityId: true
            })
            .partial({
                controlledId: true,
                controlledType: true,
                tr: true,
                receiverName: true,
                witnessName: true,
                signatureImages: true
            });

        return row.parse(body);
    }

    static undoCartAllocationValidation(body: unknown) {
        const row = CartRequestDrugValidationSchema.required({
            cartRequestDrugId: true,
            cartRequestAllocationLogId: true
        });

        return row.parse(body);
    }

    static getCartRequestAdminValidation(body: unknown) {
        const row = z
            .object({orderedBy: z.nativeEnum(BOOLEAN_VALUES), fulfilledBy: z.nativeEnum(BOOLEAN_VALUES)})
            .partial({
                orderedBy: true,
                fulfilledBy: true
            })
            .refine((data) => data.orderedBy || data.fulfilledBy, {message: "orderedBy or fulfilledBy is required"});

        return row.parse(body);
    }

    static removeCartRequestDrugValidation(body: unknown) {
        const row = CartRequestDrugValidationSchema.required({
            cartRequestDrugId: true,
            facilityId: true
        });

        return row.parse(body);
    }

    static initialAllocationValidation(body: unknown) {
        const row = CartRequestDrugValidationSchema.merge(FormularyValidationSchema)
            .merge(CartValidationSchema)
            .required({
                id: true,
                drug: true,
                cart: true
            })
            .partial({
                tr: true,
                controlledId: true,
                packageQuantity: true,
                totalUnits: true
            })
            .refine((data) => data.packageQuantity || data.totalUnits, {
                message: "packageQuantity or totalUnits are required"
            });

        return row.parse(body);
    }
}
