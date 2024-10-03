import type {IServiceDisruptionEntity} from "@entities/ServiceDisruption/ServiceDisruptionEntity";
import type {IServiceDisruptionPatientEntity} from "@entities/ServiceDisruptionPatient/ServiceDisruptionPatientEntity";
import type {ServiceDisruptionPatient} from "@infrastructure/Database/Models/ServiceDisruptionPatient";
import type {TQueryBuilder} from "@src/typings/ORM";

export type TFilterServiceDisruptionPatient = Partial<IServiceDisruptionPatientEntity & IServiceDisruptionEntity>;
type TQueryBuilderServiceDisruptionPatient = TQueryBuilder<ServiceDisruptionPatient>;

export class ServiceDisruptionPatientQueryBuilder {
    private query: TQueryBuilderServiceDisruptionPatient;
    constructor(query: TQueryBuilderServiceDisruptionPatient, filters: TFilterServiceDisruptionPatient) {
        this.query = query;

        this.setServiceDisruptionId(filters);
        this.setServiceDisruptionDate(filters);
        this.setServiceDisruptionTime(filters);
        this.setServiceDisruptionService(filters);
        this.setServiceDisruptionReason(filters);
    }

    static setFilter(query: TQueryBuilderServiceDisruptionPatient, filters) {
        return new ServiceDisruptionPatientQueryBuilder(query, filters).query;
    }

    setServiceDisruptionId(filters: TFilterServiceDisruptionPatient) {
        if (filters.serviceDisruptionId) {
            this.query.andWhere("serviceDisruption.serviceDisruptionId = :serviceDisruptionId", {
                serviceDisruptionId: filters.serviceDisruptionId
            });
        }
    }

    setServiceDisruptionDate(filters: TFilterServiceDisruptionPatient) {
        if (filters.date) {
            this.query.andWhere("serviceDisruption.date = :date", {
                date: filters.date
            });
        }
    }

    setServiceDisruptionTime(filters: TFilterServiceDisruptionPatient) {
        if (filters.time) {
            this.query.andWhere("serviceDisruption.time = :time", {
                time: filters.time
            });
        }
    }

    setServiceDisruptionService(filters: TFilterServiceDisruptionPatient) {
        if (filters.service) {
            this.query.andWhere("serviceDisruption.service = :service", {
                service: filters.service
            });
        }
    }

    setServiceDisruptionReason(filters: TFilterServiceDisruptionPatient) {
        if (filters.reason) {
            this.query.andWhere("serviceDisruption.reason = :reason", {
                reason: filters.reason
            });
        }
    }
}
