import {inject, injectable} from "tsyringe";

import {ServiceDisruptionPatientEntity} from "@entities/ServiceDisruptionPatient/ServiceDisruptionPatientEntity";

import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {ServiceDisruptionPatientFilter} from "@repositories/Shared/ORM/ServiceDisruptionPatientFilter";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddServiceDisruptionPatientDto} from "./Dtos/AddServiceDisruptionPatientDto";
import type {GetServiceDisruptionPatientDto} from "./Dtos/GetServiceDisruptionPatientDto";
import type {IServiceDisruptionPatientRepository} from "@entities/ServiceDisruptionPatient/IServiceDisruptionPatientRepository";
import type {ServiceDisruptionPatient} from "@infrastructure/Database/Models/ServiceDisruptionPatient";
import type {TFilterServiceDisruptionPatient} from "@repositories/Shared/Query/ServiceDisruptionPatientQueryBuilder";

@injectable()
export class ServiceDisruptionPatientService extends BaseService<
    ServiceDisruptionPatient,
    ServiceDisruptionPatientEntity
> {
    constructor(
        @inject("IServiceDisruptionPatientRepository")
        private serviceDisruptionPatientRepository: IServiceDisruptionPatientRepository
    ) {
        super(serviceDisruptionPatientRepository);
    }

    async fetchBySearchQuery(searchFilters: TFilterServiceDisruptionPatient) {
        return await this.serviceDisruptionPatientRepository.fetchBySearchQuery(searchFilters);
    }

    async addServiceDisruptionPatient(addServiceDisruptionPatientDto: AddServiceDisruptionPatientDto) {
        try {
            const serviceDisruptionPatientEntity =
                ServiceDisruptionPatientEntity.create(addServiceDisruptionPatientDto);
            serviceDisruptionPatientEntity.serviceDisruptionPatientId = SharedUtils.shortUuid();
            await this.create(serviceDisruptionPatientEntity);
        } catch (error) {
            ErrorLog(error);
        }
    }

    async getServiceDisruptionPatient(dtoGetServiceDisruptionPatient: GetServiceDisruptionPatientDto) {
        try {
            const searchFilters = ServiceDisruptionPatientFilter.setFilter(dtoGetServiceDisruptionPatient);
            const serviceDisruptionPatient = await this.fetch(searchFilters);

            if (!serviceDisruptionPatient) {
                return false;
            }

            return serviceDisruptionPatient;
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getServiceDisruptionPatients(dtoGetServiceDisruptionPatient: GetServiceDisruptionPatientDto) {
        try {
            const searchFilters = dtoGetServiceDisruptionPatient;
            const serviceDisruptionPatient = await this.fetchBySearchQuery(searchFilters);
            if (!serviceDisruptionPatient) {
                return HttpResponse.notFound();
            }

            const serviceDisruptionEntities = serviceDisruptionPatient.map((sd) =>
                ServiceDisruptionPatientEntity.publicFields(sd)
            );

            return HttpResponse.ok(serviceDisruptionEntities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
