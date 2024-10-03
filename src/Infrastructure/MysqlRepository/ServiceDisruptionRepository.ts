import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";
import {SEARCH_SERVICE_DISRUPTION_REPOSITORY_FIELDS} from "@repositories/Shared/Query/FieldsBuilder";
import {ServiceDisruptionQueryBuilder} from "@repositories/Shared/Query/ServiceDisruptionQueryBuilder";

import {ServiceDisruption} from "@infrastructure/Database/Models/ServiceDisruption";

import type {IServiceDisruptionRepository} from "@entities/ServiceDisruption/IServiceDisruptionRepository";
import type {ServiceDisruptionEntity} from "@entities/ServiceDisruption/ServiceDisruptionEntity";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TSearchFilters} from "@typings/ORM";

@injectable()
export class ServiceDisruptionRepository
    extends BaseRepository<ServiceDisruption, ServiceDisruptionEntity>
    implements IServiceDisruptionRepository
{
    constructor() {
        super(ServiceDisruption);
    }

    async fetchPaginatedBySearchQuery(
        searchFilters: TSearchFilters<ServiceDisruption>,
        pagination: PaginationOptions
    ): Promise<false | {count: number; rows: ServiceDisruption[]}> {
        const query = this.model
            .createQueryBuilder("serviceDisruption")
            .leftJoin("serviceDisruption.serviceDisruptionPatient", "serviceDisruptionPatient")
            .leftJoin("serviceDisruption.facility", "facility")
            .where("1=1")
            .andWhere("serviceDisruption.deletedAt IS NULL")
            .groupBy("serviceDisruption.serviceDisruptionId")
            .limit(pagination.perPage)
            .offset(pagination.offset)
            .orderBy("serviceDisruption.id", "DESC");

        const countQuery = this.model
            .createQueryBuilder("serviceDisruption")
            .leftJoin("serviceDisruption.facility", "facility")
            .where("1=1");

        const queryFilters = ServiceDisruptionQueryBuilder.setFilter(query, searchFilters);
        const countFilters = ServiceDisruptionQueryBuilder.setFilter(countQuery, searchFilters);

        const serviceDisruptionCount = await countFilters.getCount();
        const serviceDisruption = await queryFilters.select(SEARCH_SERVICE_DISRUPTION_REPOSITORY_FIELDS).getRawMany();

        if (serviceDisruption.length === 0) {
            return false;
        }

        return {count: serviceDisruptionCount, rows: serviceDisruption};
    }
}
