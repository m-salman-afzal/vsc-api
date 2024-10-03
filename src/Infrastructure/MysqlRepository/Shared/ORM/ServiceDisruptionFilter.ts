import type {IServiceDisruptionEntity} from "@entities/ServiceDisruption/ServiceDisruptionEntity";
import type {ServiceDisruption} from "@infrastructure/Database/Models/ServiceDisruption";
import type {TWhereFilter} from "@typings/ORM";

type TFilterServiceDisruption = Partial<IServiceDisruptionEntity>;

type TWhereServiceDisruption = TWhereFilter<ServiceDisruption>;

export class ServiceDisruptionFilter {
    private where: TWhereServiceDisruption;
    constructor(filters: TFilterServiceDisruption) {
        this.where = {};
        this.setServiceDisruptionId(filters);
        this.setFacilityId(filters);
    }

    static setFilter(filters: TFilterServiceDisruption) {
        return new ServiceDisruptionFilter(filters).where;
    }

    setServiceDisruptionId(filters: TFilterServiceDisruption) {
        if (filters.serviceDisruptionId) {
            this.where.serviceDisruptionId = filters.serviceDisruptionId;
        }
    }

    setFacilityId(filters: TFilterServiceDisruption) {
        if (filters.facilityId) {
            this.where.facilityId = filters.facilityId;
        }
    }
}
