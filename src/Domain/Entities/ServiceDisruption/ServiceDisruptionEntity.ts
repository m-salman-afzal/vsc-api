import SharedUtils from "@appUtils/SharedUtils";

import type {ServiceDisruptionPatientEntity} from "@entities/ServiceDisruptionPatient/ServiceDisruptionPatientEntity";

export interface IServiceDisruptionEntity {
    serviceDisruptionId: string;
    date: string;
    time: string;
    service: string;
    reason: string;
    facilityId: string;
    adminId: string;
    serviceDisruptionPatient?: ServiceDisruptionPatientEntity[];
}

export interface ServiceDisruptionEntity extends IServiceDisruptionEntity {}

export class ServiceDisruptionEntity {
    constructor(serviceDisruptionEntity: IServiceDisruptionEntity) {
        this.serviceDisruptionId = serviceDisruptionEntity.serviceDisruptionId;
        this.date = serviceDisruptionEntity.date
            ? SharedUtils.setDate(serviceDisruptionEntity.date)
            : serviceDisruptionEntity.date;
        this.time = serviceDisruptionEntity.time
            ? SharedUtils.setTime(serviceDisruptionEntity.time)
            : serviceDisruptionEntity.time;
        this.service = serviceDisruptionEntity.service
            ? serviceDisruptionEntity.service.trim()
            : serviceDisruptionEntity.service;
        this.reason = serviceDisruptionEntity.reason
            ? serviceDisruptionEntity.reason.trim()
            : serviceDisruptionEntity.reason;
        this.facilityId = serviceDisruptionEntity.facilityId;
        this.adminId = serviceDisruptionEntity.adminId;
    }

    static create(serviceDisruptionEntity) {
        return new ServiceDisruptionEntity(serviceDisruptionEntity);
    }

    static publicFields(serviceDisruptionEntity) {
        const entity = new ServiceDisruptionEntity(serviceDisruptionEntity);

        return {
            ...entity,
            serviceDisruptionPatients: serviceDisruptionEntity.serviceDisruptionPatients
                ? Number(serviceDisruptionEntity.serviceDisruptionPatients)
                : 0,
            dateTimeUtc: SharedUtils.convertEasternDateTimeToUtc(
                serviceDisruptionEntity.date,
                serviceDisruptionEntity.time
            )
        };
    }
}
