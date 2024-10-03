import type {ReferenceGuideDrugEntity} from "./ReferenceGuideDrugEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {ReferenceGuideDrug} from "@infrastructure/Database/Models/ReferenceGuideDrug";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TFilterReferenceGuideDrug} from "@repositories/Shared/Query/ReferenceGuideDrugQueryBuilder";

export interface IReferenceGuideDrugRepository extends IBaseRepository<ReferenceGuideDrug, ReferenceGuideDrugEntity> {
    fetchPaginatedBySearchQuery(
        searchFilters: TFilterReferenceGuideDrug,
        pagination: PaginationOptions
    ): Promise<false | {count: number; rows: ReferenceGuideDrug[]}>;

    fetchPaginatedWithCart(
        searchFilters: TFilterReferenceGuideDrug,
        pagination: PaginationOptions
    ): Promise<false | {count: number; rows: ReferenceGuideDrug[]}>;

    fetchBySearchQuery(searchFilters: TFilterReferenceGuideDrug): Promise<false | ReferenceGuideDrug[]>;

    fetchDistinctCategories(searchFilters): any;
}
