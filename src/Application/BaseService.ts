import type IBaseRepository from "@entities/IBaseRepository";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TOrderBy, TSearchFilters, TSearchFiltersForRemove, TSearchFiltersForUpdate} from "@typings/ORM";
import type {DeepPartial, ObjectLiteral} from "typeorm";

export class BaseService<Model extends ObjectLiteral, Entity extends DeepPartial<Model>> {
    constructor(private baseRepository: IBaseRepository<Model, Entity>) {}

    async create(entity: Entity) {
        return await this.baseRepository.create(entity);
    }

    async update(searchFilters: TSearchFiltersForUpdate<Model>, entity: Entity, isDelete?: boolean) {
        return await this.baseRepository.update(searchFilters, entity, isDelete);
    }

    async upsert(searchFilters: TSearchFiltersForUpdate<Model>, entity: Entity) {
        return await this.baseRepository.upsert(entity, searchFilters);
    }

    async remove(searchFilters: TSearchFiltersForRemove<Model>) {
        return await this.baseRepository.remove(searchFilters);
    }

    async restore(searchFilters: TSearchFiltersForRemove<Model>) {
        return await this.baseRepository.restore(searchFilters);
    }

    async bulkInsert(entities: Entity[]) {
        return await this.baseRepository.bulkInsert(entities);
    }

    async fetch(searchFilters: TSearchFilters<Model>) {
        return await this.baseRepository.fetch(searchFilters);
    }

    async fetchAll(searchFilters: TSearchFilters<Model>, orderBy: TOrderBy<Model>) {
        return await this.baseRepository.fetchAll(searchFilters, orderBy);
    }

    async count(searchFilters: TSearchFilters<Model>) {
        return await this.baseRepository.count(searchFilters);
    }

    async fetchPaginated(
        searchFilters: TSearchFilters<Model>,
        orderBy: TOrderBy<Model>,
        pagination: PaginationOptions
    ) {
        return await this.baseRepository.fetchPaginated(searchFilters, orderBy, pagination);
    }

    async fetchWithDeleted(searchFilters: TSearchFilters<Model>) {
        return await this.baseRepository.fetchWithDeleted(searchFilters);
    }

    async fetchAllWithDeleted(searchFilters: TSearchFilters<Model>) {
        return await this.baseRepository.fetchAllWithDeleted(searchFilters);
    }
}
