import type {IReferenceGuideDrugEntity} from "@entities/ReferenceGuideDrug/ReferenceGuideDrugEntity";
import type {ReferenceGuideDrug} from "@infrastructure/Database/Models/ReferenceGuideDrug";
import type {TWhereFilter} from "@typings/ORM";

type TFilterReferenceGuideDrug = Partial<IReferenceGuideDrugEntity>;

type TWhereReferenceGuide = TWhereFilter<ReferenceGuideDrug>;

export class ReferenceGuideDrugFilter {
    private where: TWhereReferenceGuide;
    constructor(filters: TFilterReferenceGuideDrug) {
        this.where = {};
        this.setReferenceGuideDrugId(filters);
        this.setReferenceGuideId(filters);
        this.setFormularyId(filters);
        this.setCategory(filters);
        this.setSubCategory(filters);
        this.setMin(filters);
        this.setMax(filters);
        this.setNotes(filters);
    }

    static setFilter(filters: TFilterReferenceGuideDrug) {
        return new ReferenceGuideDrugFilter(filters).where;
    }

    setReferenceGuideDrugId(filters: TFilterReferenceGuideDrug) {
        if (filters.referenceGuideDrugId) {
            this.where.referenceGuideDrugId = filters.referenceGuideDrugId;
        }
    }

    setReferenceGuideId(filters: TFilterReferenceGuideDrug) {
        if (filters.referenceGuideId) {
            this.where.referenceGuideId = filters.referenceGuideId;
        }
    }

    setFormularyId(filters: TFilterReferenceGuideDrug) {
        if (filters.formularyId) {
            this.where.formularyId = filters.formularyId;
        }
    }

    setCategory(filters: TFilterReferenceGuideDrug) {
        if (filters.category) {
            this.where.category = filters.category;
        }
    }

    setSubCategory(filters: TFilterReferenceGuideDrug) {
        if (filters.subCategory) {
            this.where.subCategory = filters.subCategory;
        }
    }

    setMin(filters: TFilterReferenceGuideDrug) {
        if (filters.min) {
            this.where.min = filters.min;
        }
    }

    setMax(filters: TFilterReferenceGuideDrug) {
        if (filters.max) {
            this.where.max = filters.max;
        }
    }

    setNotes(filters: TFilterReferenceGuideDrug) {
        if (filters.notes) {
            this.where.notes = filters.notes;
        }
    }
}
