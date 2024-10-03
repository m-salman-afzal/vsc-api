import z from "zod";

import {CART_REQUEST_TYPE} from "@constants/CartRequestConstant";

import {CartRequestDrugValidationSchema} from "./Schemas/CartRequestDrugValidationSchema";
import {CartRequestFormValidationSchema} from "./Schemas/CartRequestFormValidationSchema";
import {CartRequestLogValidationSchema} from "./Schemas/CartRequestLogValidationSchema";
import {CartValidationSchema} from "./Schemas/CartValidationSchema";
import {FormularyValidationSchema} from "./Schemas/FormularyValidationSchema";
import PaginationValidationSchema from "./Schemas/PaginationValidationSchema";
import {stringValidation} from "./Schemas/ValidationTypes";

export class CartRequestFormValidation {
    static upsertCartRequestFormValidation(body: unknown) {
        const row = CartRequestFormValidationSchema.merge(CartRequestLogValidationSchema)
            .merge(CartRequestDrugValidationSchema)
            .merge(
                z.object({
                    signatureImages: z.object({
                        receiverSignatureImage: stringValidation,
                        witnessSignatureImage: stringValidation
                    }),
                    requestForm: z.array(
                        z.object({
                            cartRequestFormId: stringValidation.optional(),
                            pendingOrderQuantity: z.number(),
                            packageQuantity: z.number(),
                            formularyId: stringValidation,
                            cartId: stringValidation,
                            referenceGuideDrugId: stringValidation
                        })
                    )
                })
            )
            .required({
                type: true,
                requestForm: true,
                facilityId: true
            })
            .partial({
                controlledId: true,
                controlledType: true,
                receiverName: true,
                witnessName: true,
                signatureImages: true
            })
            .refine(
                (data) => {
                    if (
                        data.isControlled &&
                        data.type === CART_REQUEST_TYPE.AFTER_HOUR &&
                        !(
                            data.controlledType &&
                            data.tr &&
                            data.controlledId &&
                            data.receiverName &&
                            data.witnessName &&
                            data.signatureImages
                        )
                    ) {
                        return false;
                    }

                    return true;
                },
                {message: "After Hour Info is required"}
            );

        return row.parse(body);
    }

    static getCartRequestFormsValidation(body: unknown) {
        const row = FormularyValidationSchema.merge(PaginationValidationSchema)
            .merge(CartRequestLogValidationSchema)
            .merge(CartValidationSchema)
            .required({
                type: true,
                cartId: true,
                facilityId: true
            })
            .partial({
                isControlled: true,
                currentPage: true,
                perPage: true,
                name: true
            })
            .refine((data) => {
                if (data.type === CART_REQUEST_TYPE.AFTER_HOUR && !data.isControlled) {
                    return false;
                }

                return true;
            });

        return row.parse(body);
    }
}
