import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {
    TOrderBy,
    TSearchFilters,
    TSearchFiltersForRemove,
    TSearchFiltersForUpdate,
    TUpdateEntity,
    TUpdateResult,
    TUpsertEntity,
    TUpsertOptions,
    TUpsertResult
} from "@typings/ORM";
import type {DeepPartial} from "typeorm";

export default interface IBaseRepository<Model, Entity extends DeepPartial<Model>> {
    create(entity: Entity): Promise<Entity>;
    update(
        searchFilters: TSearchFiltersForUpdate<Model>,
        entity: TUpdateEntity<Model>,
        isDelete?: boolean
    ): Promise<TUpdateResult>;
    upsert(entity: TUpdateEntity<Model>, searchFilters: TUpsertOptions<Model>): Promise<Entity | TUpdateResult>;
    remove(searchFilters: TSearchFiltersForRemove<Model>): Promise<TUpdateResult>;
    restore(searchFilters: TSearchFiltersForRemove<Model>): Promise<TUpdateResult>;
    bulkInsert(entities: TUpsertEntity<Model>): TUpsertResult;
    fetch(searchFilters: TSearchFilters<Model>): Promise<false | Model>;
    fetchAll(searchFilters: TSearchFilters<Model>, order: TOrderBy<Model>): Promise<false | Model[]>;
    count(searchFilters: TSearchFilters<Model>): Promise<number>;
    fetchPaginated(
        searchFilters: TSearchFilters<Model>,
        order: TOrderBy<Model>,
        pagination: PaginationOptions
    ): Promise<false | Model[]>;
    fetchWithDeleted(searchFilters: TSearchFilters<Model>): Promise<false | Model>;
    fetchAllWithDeleted(searchFilters: TSearchFilters<Model>): Promise<false | Model[]>;
}
