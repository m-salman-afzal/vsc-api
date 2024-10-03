import type IBaseRepository from "@entities/IBaseRepository";
import type {ServiceDisruptionEntity} from "@entities/ServiceDisruption/ServiceDisruptionEntity";
import type {ServiceDisruption} from "@infrastructure/Database/Models/ServiceDisruption";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TSearchFilters} from "@typings/ORM";

export interface IServiceDisruptionRepository extends IBaseRepository<ServiceDisruption, ServiceDisruptionEntity> {
    fetchPaginatedBySearchQuery(
        searchFilters: TSearchFilters<ServiceDisruption>,
        pagination: PaginationOptions
    ): Promise<false | {count: number; rows: ServiceDisruption[]}>;
}
