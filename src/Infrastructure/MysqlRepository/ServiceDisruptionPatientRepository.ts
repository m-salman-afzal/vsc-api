import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";
import {SEARCH_SERVICE_DISRUPTION_PATIENT_REPOSITORY_FIELDS} from "@repositories/Shared/Query/FieldsBuilder";
import {ServiceDisruptionPatientQueryBuilder} from "@repositories/Shared/Query/ServiceDisruptionPatientQueryBuilder";

import {ServiceDisruptionPatient} from "@infrastructure/Database/Models/ServiceDisruptionPatient";

import type {IServiceDisruptionPatientRepository} from "@entities/ServiceDisruptionPatient/IServiceDisruptionPatientRepository";
import type {ServiceDisruptionPatientEntity} from "@entities/ServiceDisruptionPatient/ServiceDisruptionPatientEntity";
import type {TSearchFilters} from "@typings/ORM";

@injectable()
export class ServiceDisruptionPatientRepository
    extends BaseRepository<ServiceDisruptionPatient, ServiceDisruptionPatientEntity>
    implements IServiceDisruptionPatientRepository
{
    constructor() {
        super(ServiceDisruptionPatient);
    }

    async fetchBySearchQuery(
        searchFilters: TSearchFilters<ServiceDisruptionPatient>
    ): Promise<false | ServiceDisruptionPatient[]> {
        const query = this.model
            .createQueryBuilder("serviceDisruptionPatient")
            .withDeleted()
            .leftJoin("serviceDisruptionPatient.serviceDisruption", "serviceDisruption")
            .where("1=1")
            .andWhere("serviceDisruptionPatient.deletedAt IS NULL");

        const queryFilters = ServiceDisruptionPatientQueryBuilder.setFilter(query, searchFilters);

        const serviceDisruptionPatients = await queryFilters
            .select(SEARCH_SERVICE_DISRUPTION_PATIENT_REPOSITORY_FIELDS)
            .getRawMany();

        if (serviceDisruptionPatients.length === 0) {
            return false;
        }

        return serviceDisruptionPatients;
    }
}
