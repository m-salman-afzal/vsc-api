import {Like} from "typeorm";

import type {IServiceDisruptionPatientEntity} from "@entities/ServiceDisruptionPatient/ServiceDisruptionPatientEntity";
import type {ServiceDisruptionPatient} from "@infrastructure/Database/Models/ServiceDisruptionPatient";
import type {TWhereFilter} from "@typings/ORM";

type TFilterServiceDisruptionPatient = Partial<IServiceDisruptionPatientEntity>;
type TWhereServiceDisruptionPatient = TWhereFilter<ServiceDisruptionPatient>;

export class ServiceDisruptionPatientFilter {
    private where: TWhereServiceDisruptionPatient;
    constructor(filters: TFilterServiceDisruptionPatient) {
        this.where = {};

        this.setServiceDisruptionId(filters);
        this.setServiceDisruptionPatientName(filters);
        this.setServiceDisruptionPatientNumber(filters);
        this.setServiceDisruptionPatientComments(filters);
        this.setServiceDisruptionPatientDelayPeriod(filters);
        this.setServiceDisruptionTime(filters);
    }

    static setFilter(filters: TFilterServiceDisruptionPatient) {
        return new ServiceDisruptionPatientFilter(filters).where;
    }

    setServiceDisruptionId(filters: TFilterServiceDisruptionPatient) {
        if (filters.serviceDisruptionId) {
            this.where.serviceDisruptionId = filters.serviceDisruptionId;
        }
    }

    setServiceDisruptionPatientName(filters: TFilterServiceDisruptionPatient) {
        if (filters.patientName) {
            this.where.patientName = Like(`%${filters.patientName}%`);
        }
    }

    setServiceDisruptionPatientNumber(filters: TFilterServiceDisruptionPatient) {
        if (filters.patientNumber) {
            this.where.patientNumber = Like(`%${filters.patientNumber}%`);
        }
    }

    setServiceDisruptionPatientComments(filters: TFilterServiceDisruptionPatient) {
        if (filters.comments) {
            this.where.comments = Like(`%${filters.comments}%`);
        }
    }

    setServiceDisruptionPatientDelayPeriod(filters: TFilterServiceDisruptionPatient) {
        if (filters.delayPeriod) {
            this.where.delayPeriod = Like(`%${filters.delayPeriod}%`);
        }
    }

    setServiceDisruptionTime(filters: TFilterServiceDisruptionPatient) {
        if (filters.time) {
            this.where.time = filters.time;
        }
    }
}
