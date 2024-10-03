import type {IServiceDisruptionEntity} from "@entities/ServiceDisruption/ServiceDisruptionEntity";
import type {ServiceDisruption} from "@infrastructure/Database/Models/ServiceDisruption";
import type {TQueryBuilder} from "@src/typings/ORM";

export type TFilterServiceDisruption = Partial<IServiceDisruptionEntity>;
type TQueryBuilderServiceDisruption = TQueryBuilder<ServiceDisruption>;

export class ServiceDisruptionQueryBuilder {
    private query: TQueryBuilderServiceDisruption;
    constructor(query: TQueryBuilderServiceDisruption, filters: TFilterServiceDisruption) {
        this.query = query;

        this.setServiceDisruptionId(filters);
        this.setServiceDisruptionDate(filters);
        this.setServiceDisruptionTime(filters);
        this.setServiceDisruptionService(filters);
        this.setServiceDisruptionReason(filters);
        this.setFacilityId(filters);
    }

    static setFilter(query: TQueryBuilderServiceDisruption, filters) {
        return new ServiceDisruptionQueryBuilder(query, filters).query;
    }

    setServiceDisruptionId(filters: TFilterServiceDisruption) {
        if (filters.serviceDisruptionId) {
            this.query.andWhere("serviceDisruption.serviceDisruptionId = :serviceDisruptionId", {
                serviceDisruptionId: filters.serviceDisruptionId
            });
        }
    }

    setServiceDisruptionDate(filters: TFilterServiceDisruption) {
        if (filters.date) {
            this.query.andWhere("serviceDisruption.date = :date", {
                date: filters.date
            });
        }
    }

    setServiceDisruptionTime(filters: TFilterServiceDisruption) {
        if (filters.time) {
            this.query.andWhere("serviceDisruption.time = :time", {
                time: filters.time
            });
        }
    }

    setServiceDisruptionService(filters: TFilterServiceDisruption) {
        if (filters.service) {
            this.query.andWhere("serviceDisruption.service = :service", {
                service: filters.service
            });
        }
    }

    setServiceDisruptionReason(filters: TFilterServiceDisruption) {
        if (filters.reason) {
            this.query.andWhere("serviceDisruption.reason = :reason", {
                reason: filters.reason
            });
        }
    }

    setFacilityId(filters: TFilterServiceDisruption) {
        if (Array.isArray(filters.facilityId)) {
            this.query.andWhere("facility.facilityId IN (:...facilityId)", {facilityId: filters.facilityId});

            return;
        }

        if (filters.facilityId) {
            this.query.andWhere("facility.facilityId = :facilityId", {facilityId: filters.facilityId});
        }
    }
}
