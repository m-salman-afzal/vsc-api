import {DRUG_TYPES} from "@constants/FormularyConstant";

import {FormularyValidationSchema} from "@validations/Schemas/FormularyValidationSchema";
import PaginationValidationSchema from "@validations/Schemas/PaginationValidationSchema";

export class FormularyValidation {
    static addFormularyValidation(body: unknown) {
        const row = FormularyValidationSchema.required({
            drugName: true,
            genericName: true,
            strengthUnit: true,
            formulation: true,
            isFormulary: true
        })
            .partial({
                brandName: true,
                release: true,
                package: true,
                isGeneric: true,
                drugClass: true,
                isActive: true,
                isControlled: true,

                unitsPkg: true
            })
            .refine((data) => (data.drugName === DRUG_TYPES.BRAND ? Boolean(data.brandName) : true), {
                message: "brandName must be given"
            });

        return row.parse(body);
    }

    static bulkAddFormularyValidation(body: unknown) {
        const bulkAddFormulary = FormularyValidationSchema.partial({
            id: true,
            brandName: true,
            genericName: true,
            isGeneric: true,
            drugName: true,
            strengthUnit: true,
            formulation: true,
            release: true,
            package: true,
            unitsPkg: true,
            drugClass: true,
            isControlled: true,
            isFormulary: true,
            isActive: true
        })
            .refine(
                (data) => {
                    if (data.id) {
                        return true;
                    } else {
                        return data.drugName && data.drugName && data.strengthUnit && data.formulation;
                    }
                },
                {message: "Bulk Add Formulary without id requires drugName, drugName, strengthUnit and formulation"}
            )
            .refine(
                (data) => {
                    const keys = Object.keys(data);
                    const isDelete = keys.every((key) => {
                        return key === "id" ? data[key] !== undefined : data[key] === undefined;
                    });

                    if (isDelete) {
                        return true;
                    } else {
                        return data.drugName === DRUG_TYPES.BRAND ? Boolean(data.brandName) : true;
                    }
                },
                {message: "brandName must be given"}
            );

        return bulkAddFormulary.parse(body);
    }

    static getFormularyValidation(body: unknown) {
        const row = FormularyValidationSchema.merge(PaginationValidationSchema).partial({
            currentPage: true,
            perPage: true,
            name: true,
            isActive: true,
            refillStock: true,
            isControlled: true,
            isFormulary: true
        });

        return row.parse(body);
    }

    static updateFormualaryValidation(body: unknown) {
        const row = FormularyValidationSchema.partial({
            formularyId: true,
            id: true,
            brandName: true,
            genericName: true,
            drugName: true,
            isGeneric: true,
            drugClass: true,
            strengthUnit: true,
            formulation: true,
            release: true,
            package: true,
            unitsPkg: true,
            isActive: true,
            isFormulary: true,
            isControlled: true
        })
            .refine((data) => data.formularyId || data.id, {message: "formularyId or id must be given"})
            .refine((data) => (data.drugName === DRUG_TYPES.BRAND ? Boolean(data.brandName) : true), {
                message: "brandName must be given"
            });

        return row.parse(body);
    }

    static removeFormularyValidation(body: unknown) {
        const row = FormularyValidationSchema.partial({
            formularyId: true,
            id: true
        }).refine((data) => data.formularyId || data.id, {message: "formularyId or id must be given"});

        return row.parse(body);
    }

    static refillStockFormularyValidation(body: unknown) {
        const row = FormularyValidationSchema.merge(PaginationValidationSchema)
            .required({formularyId: true})
            .refine((data) => Array.isArray(data.formularyId), {message: "formularyId must be an array"});

        return row.parse(body);
    }
}
