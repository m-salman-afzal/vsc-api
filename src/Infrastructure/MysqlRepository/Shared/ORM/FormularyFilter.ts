import {In, Like, Not} from "typeorm";

import type {IFormularyEntity} from "@entities/Formulary/FormularyEntity";
import type {Formulary} from "@infrastructure/Database/Models/Formulary";
import type {ReplaceKeys} from "@typings/Misc";
import type {TWhereFilter} from "@typings/ORM";

type TFilterFormulary = ReplaceKeys<Partial<IFormularyEntity>, "formularyId", {formularyId: string | string[]}> & {
    id?: number;
    dupGenericName?: string;
    dupBrandName?: string;
    refillStock?: boolean;
};

type TWhereFormulary = TWhereFilter<Formulary>;

export class FormularyFilter {
    private where: TWhereFormulary;
    constructor(filters: TFilterFormulary) {
        this.where = {};

        this.setId(filters);
        this.setFormularyId(filters);
        this.setBrandName(filters);
        this.setGenericName(filters);
        this.setDrugName(filters);
        this.setFormulation(filters);
        this.setDrugClass(filters);
        this.setStrengthUnit(filters);
        this.setIsActive(filters);
        this.setRefillStock(filters);
        this.setIsControlled(filters);
        this.setIsFormulary(filters);
    }

    static setFilter(filters: TFilterFormulary) {
        return new FormularyFilter(filters).where;
    }

    setId(filters: TFilterFormulary) {
        if (filters.id && !Array.isArray(filters.id)) {
            this.where.id = filters.id;
        }
    }

    setFormularyId(filters: TFilterFormulary) {
        if (filters.formularyId && Array.isArray(filters.formularyId)) {
            this.where.formularyId = In(filters.formularyId);

            return;
        }

        if (filters.formularyId && !Array.isArray(filters.formularyId)) {
            this.where.formularyId = filters.formularyId;
        }
    }

    setBrandName(filters: TFilterFormulary) {
        if (filters.dupBrandName) {
            this.where.brandName = filters.dupBrandName;

            return;
        }

        if (filters.brandName) {
            this.where.brandName = Like(`%${filters.brandName}%`);
        }
    }

    setGenericName(filters: TFilterFormulary) {
        if (filters.dupGenericName) {
            this.where.genericName = filters.dupGenericName;

            return;
        }

        if (filters.genericName) {
            this.where.genericName = Like(`%${filters.genericName}%`);
        }
    }

    setDrugName(filters: TFilterFormulary) {
        if (filters.drugName) {
            this.where.drugName = filters.drugName;
        }
    }

    setFormulation(filters: TFilterFormulary) {
        if (filters.formulation) {
            this.where.formulation = filters.formulation;
        }
    }

    setDrugClass(filters: TFilterFormulary) {
        if (filters.drugClass) {
            this.where.drugClass = filters.drugClass;
        }
    }

    setStrengthUnit(filters: TFilterFormulary) {
        if (filters.strengthUnit) {
            this.where.strengthUnit = filters.strengthUnit;
        }
    }

    setIsActive(filters: TFilterFormulary) {
        if ("isActive" in filters && filters.isActive !== undefined && filters.isActive !== null) {
            this.where.isActive = filters.isActive;
        }
    }

    setIsControlled(filters: TFilterFormulary) {
        if ("isControlled" in filters && filters.isControlled !== undefined && filters.isControlled !== null) {
            this.where.isControlled = filters.isControlled;
        }
    }

    setIsFormulary(filters: TFilterFormulary) {
        if ("isFormulary" in filters && filters.isFormulary !== undefined && filters.isFormulary !== null) {
            this.where.isFormulary = filters.isFormulary;
        }
    }

    setRefillStock(filters: TFilterFormulary) {
        if (filters.refillStock && Array.isArray(filters.formularyId)) {
            this.where.formularyId = Not(In(filters.formularyId));
        }
    }
}
