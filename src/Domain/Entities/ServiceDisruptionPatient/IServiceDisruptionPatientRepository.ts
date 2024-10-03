import type IBaseRepository from "@entities/IBaseRepository";
import type {ServiceDisruptionPatientEntity} from "@entities/ServiceDisruptionPatient/ServiceDisruptionPatientEntity";
import type {ServiceDisruptionPatient} from "@infrastructure/Database/Models/ServiceDisruptionPatient";
import type {TSearchFilters} from "@typings/ORM";

export interface IServiceDisruptionPatientRepository
    extends IBaseRepository<ServiceDisruptionPatient, ServiceDisruptionPatientEntity> {
    fetchBySearchQuery(
        searchFilters: TSearchFilters<ServiceDisruptionPatient>
    ): Promise<false | ServiceDisruptionPatient[]>;
}
