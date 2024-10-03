import {injectable} from "tsyringe";

import {ORDER_BY} from "@appUtils/Constants";

import BaseRepository from "@repositories/BaseRepository";
import {SEARCH_REFERENCE_GUIDE_DRUG_REPOSITORY_FIELDS} from "@repositories/Shared/Query/FieldsBuilder";

import {ReferenceGuideDrug} from "@infrastructure/Database/Models/ReferenceGuideDrug";

import {ReferenceGuideDrugQueryBuilder} from "./Shared/Query/ReferenceGuideDrugQueryBuilder";

import type {TFilterReferenceGuideDrug} from "./Shared/Query/ReferenceGuideDrugQueryBuilder";
import type {IReferenceGuideDrugRepository} from "@entities/ReferenceGuideDrug/IReferenceGuideDrugRepository";
import type {ReferenceGuideDrugEntity} from "@entities/ReferenceGuideDrug/ReferenceGuideDrugEntity";
import type PaginationOptions from "@infraUtils/PaginationOptions";

@injectable()
export class ReferenceGuideDrugRepository
    extends BaseRepository<ReferenceGuideDrug, ReferenceGuideDrugEntity>
    implements IReferenceGuideDrugRepository
{
    constructor() {
        super(ReferenceGuideDrug);
    }

    async fetchPaginatedBySearchQuery(searchFilters: TFilterReferenceGuideDrug, pagination: PaginationOptions) {
        const query = this.model
            .createQueryBuilder("referenceGuideDrug")
            .withDeleted()
            .leftJoinAndSelect("referenceGuideDrug.referenceGuide", "referenceGuide")
            .leftJoinAndSelect("referenceGuideDrug.formulary", "formulary")
            .where("formulary.deletedAt IS NULL AND referenceGuideDrug.deletedAt IS NULL")
            .orderBy("formulary.name", "ASC")
            .limit(pagination.perPage)
            .offset(pagination.offset);

        const countQuery = this.model
            .createQueryBuilder("referenceGuideDrug")
            .withDeleted()
            .leftJoinAndSelect("referenceGuideDrug.referenceGuide", "referenceGuide")
            .leftJoinAndSelect("referenceGuideDrug.formulary", "formulary")
            .where("formulary.deletedAt IS NULL AND referenceGuideDrug.deletedAt IS NULL");

        const queryFilters = ReferenceGuideDrugQueryBuilder.setFilter(query, searchFilters);
        const countFilters = ReferenceGuideDrugQueryBuilder.setFilter(countQuery, searchFilters);

        const count = await countFilters.getCount();
        const rows = await queryFilters.getMany();

        if (rows.length === 0) {
            return false;
        }

        return {count: count, rows: rows};
    }

    async fetchBySearchQuery(searchFilters) {
        const query = this.model
            .createQueryBuilder("referenceGuideDrug")
            .leftJoin("referenceGuideDrug.formulary", "formulary")
            .leftJoin("referenceGuideDrug.referenceGuide", "referenceGuide")
            .orderBy("formulary.name", "ASC");

        const queryFilters = ReferenceGuideDrugQueryBuilder.setFilter(query, searchFilters);
        const referenceGuideDrugs = await queryFilters
            .select(SEARCH_REFERENCE_GUIDE_DRUG_REPOSITORY_FIELDS)
            .getRawMany();

        if (referenceGuideDrugs.length === 0) {
            return false;
        }

        return referenceGuideDrugs;
    }

    async fetchDistinctCategories(searchFilters) {
        const referenceGuideDrugs = await this.model
            .createQueryBuilder("referenceGuideDrug")
            .orderBy("referenceGuideDrug.category", "ASC")
            .select([
                "DISTINCT(referenceGuideDrug.category) AS category",
                "referenceGuideDrug.subCategory AS subCategory"
            ])
            .where("referenceGuideDrug.category IS NOT NULL")
            .andWhere("referenceGuideDrug.referenceGuideId = :referenceGuideId", {
                referenceGuideId: searchFilters.referenceGuideId
            })
            .getRawMany();

        if (referenceGuideDrugs.length === 0) {
            return false;
        }

        return referenceGuideDrugs;
    }

    async fetchPaginatedWithCart(searchFilters: TFilterReferenceGuideDrug, pagination: PaginationOptions) {
        const query = this.model
            .createQueryBuilder("referenceGuideDrug")
            .leftJoinAndSelect("referenceGuideDrug.referenceGuide", "referenceGuide")
            .leftJoinAndSelect("referenceGuide.cart", "cart")
            .leftJoinAndSelect("referenceGuideDrug.formulary", "formulary")
            .leftJoinAndSelect("formulary.inventory", "inventory")
            .leftJoinAndSelect(
                "inventory.controlledDrug",
                "controlledDrug",
                `${searchFilters.controlledType != null ? `controlledDrug.controlledType = :controlledType` : ""}`,
                {controlledType: searchFilters.controlledType}
            )
            .leftJoinAndSelect("referenceGuideDrug.cartRequestForm", "cartRequestForm")
            .leftJoinAndSelect("cartRequestForm.cartRequestDrug", "cartRequestDrug")
            .orderBy("formulary.name", ORDER_BY.ASC)
            .take(pagination.perPage)
            .skip(pagination.offset);

        const countQuery = this.model
            .createQueryBuilder("referenceGuideDrug")
            .leftJoinAndSelect("referenceGuideDrug.referenceGuide", "referenceGuide")
            .leftJoinAndSelect("referenceGuide.cart", "cart")
            .leftJoinAndSelect("referenceGuideDrug.formulary", "formulary")
            .leftJoinAndSelect("formulary.inventory", "inventory")
            .leftJoinAndSelect("inventory.controlledDrug", "controlledDrug")
            .leftJoinAndSelect("referenceGuideDrug.cartRequestForm", "cartRequestForm")
            .leftJoinAndSelect("cartRequestForm.cartRequestDrug", "cartRequestDrug");

        const queryFilters = ReferenceGuideDrugQueryBuilder.setFilter(query, searchFilters);
        const countFilters = ReferenceGuideDrugQueryBuilder.setFilter(countQuery, searchFilters);

        const rows = await queryFilters.getMany();
        const count = await countFilters.getCount();

        if (rows.length === 0) {
            return false;
        }

        return {count: count, rows: rows};
    }
}
