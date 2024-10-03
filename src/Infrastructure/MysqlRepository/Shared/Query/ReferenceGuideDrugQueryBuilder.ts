import {Brackets} from "typeorm";

import SharedUtils from "@appUtils/SharedUtils";

import type {ICartEntity} from "@entities/Cart/CartEntity";
import type {ICartRequestDrugEntity} from "@entities/CartRequestDrug/CartRequestDrugEntity";
import type {ControlledDrugEntity} from "@entities/ControlledDrug/ControlledDrugEntity";
import type {IFormularyEntity} from "@entities/Formulary/FormularyEntity";
import type {IReferenceGuideDrugEntity} from "@entities/ReferenceGuideDrug/ReferenceGuideDrugEntity";
import type {ReferenceGuideDrug} from "@infrastructure/Database/Models/ReferenceGuideDrug";
import type {TQueryBuilder} from "@typings/ORM";

export type TFilterReferenceGuideDrug = Partial<IReferenceGuideDrugEntity> &
    Partial<IFormularyEntity> &
    Partial<ControlledDrugEntity> &
    Partial<ICartEntity> &
    Partial<ICartRequestDrugEntity> &
    Partial<{name: string; text: string; facilityId: string; cartFacilityId: string; inventoryFacilityId: string}>;

type TQueryBuilderReferenceGuideDrug = TQueryBuilder<ReferenceGuideDrug>;

export class ReferenceGuideDrugQueryBuilder {
    private query: TQueryBuilderReferenceGuideDrug;
    constructor(query: TQueryBuilderReferenceGuideDrug, filters: TFilterReferenceGuideDrug) {
        this.query = query;

        this.setReferenceGuideId(filters);
        this.setCategory(filters);
        this.setSubCategory(filters);
        this.setText(filters);
        this.setCartId(filters);
        this.setName(filters);
        this.setFacilityId(filters);
        this.setIsControlled(filters);
        this.setCartFacilityId(filters);
        this.setInventoryFacilityId(filters);
    }

    static setFilter(query: TQueryBuilderReferenceGuideDrug, filters: TFilterReferenceGuideDrug) {
        return new ReferenceGuideDrugQueryBuilder(query, filters).query;
    }

    setReferenceGuideId(filters: TFilterReferenceGuideDrug) {
        if (filters.referenceGuideId) {
            this.query.andWhere("referenceGuide.referenceGuideId = :referenceGuideId", {
                referenceGuideId: filters.referenceGuideId
            });
        }
    }

    setFacilityId(filters: TFilterReferenceGuideDrug) {
        if (filters.facilityId) {
            this.query.andWhere("referenceGuide.facilityId = :facilityId", {
                facilityId: filters.facilityId
            });
        }
    }

    setCategory(filters: TFilterReferenceGuideDrug) {
        if (filters.category) {
            this.query.andWhere("referenceGuideDrug.category = :category", {
                category: filters.category
            });
        }
    }

    setSubCategory(filters: TFilterReferenceGuideDrug) {
        if (filters.subCategory) {
            this.query.andWhere("referenceGuideDrug.subCategory = :subCategory", {
                subCategory: filters.subCategory
            });
        }
    }

    setText(filters: TFilterReferenceGuideDrug) {
        if (filters.text) {
            this.query.andWhere(
                new Brackets((qb) => {
                    qb.orWhere("formulary.id = :id", {id: filters.text});
                    qb.orWhere("formulary.name LIKE :name", {name: `%${filters.text}%`});
                    qb.orWhere("referenceGuideDrug.notes LIKE :notes", {notes: `%${filters.text}%`});
                })
            );
        }
    }

    setCartId(filters: TFilterReferenceGuideDrug) {
        if (filters.cartId) {
            this.query.andWhere("cart.cartId = :cartId", {
                cartId: filters.cartId
            });
        }
    }

    setName(filters: TFilterReferenceGuideDrug) {
        if (filters.name) {
            this.query.andWhere("formulary.name LIKE :name", {
                name: `%${filters.name}%`
            });
        }
    }

    setCartFacilityId(filters: TFilterReferenceGuideDrug) {
        if (filters.cartFacilityId) {
            this.query.andWhere("cart.facilityId = :facilityId", {
                facilityId: filters.cartFacilityId
            });
        }
    }

    setIsControlled(filters: TFilterReferenceGuideDrug) {
        if (SharedUtils.isFalsyBooleanPresent(filters, "isControlled")) {
            this.query.andWhere("formulary.isControlled = :isControlled", {
                isControlled: filters.isControlled
            });
        }
    }

    setInventoryFacilityId(filters: TFilterReferenceGuideDrug) {
        if (filters.inventoryFacilityId) {
            this.query.andWhere("inventory.facilityId = :inventoryFacilityId", {
                inventoryFacilityId: filters.inventoryFacilityId
            });
        }
    }

    setControlledType(filters: TFilterReferenceGuideDrug) {
        if (filters.controlledType) {
            this.query.andWhere("controlledDrug.controlledType = :controlledType", {
                controlledType: filters.controlledType
            });
        }
    }
}
