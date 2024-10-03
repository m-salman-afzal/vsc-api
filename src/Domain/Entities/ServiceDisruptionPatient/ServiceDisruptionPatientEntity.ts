import {ServiceDisruptionEntity} from "@entities/ServiceDisruption/ServiceDisruptionEntity";

export interface IServiceDisruptionPatientEntity {
    serviceDisruptionPatientId: string;
    patientName: string;
    patientNumber: string;
    time: string;
    comments: string;
    delayPeriod: string;
    serviceDisruptionId: string;
}

export interface ServiceDisruptionPatientEntity extends IServiceDisruptionPatientEntity {}

export class ServiceDisruptionPatientEntity {
    constructor(serviceDisruptionPatientEntity: IServiceDisruptionPatientEntity) {
        this.serviceDisruptionPatientId = serviceDisruptionPatientEntity.serviceDisruptionPatientId;
        this.patientName = serviceDisruptionPatientEntity.patientName
            ? serviceDisruptionPatientEntity.patientName.trim()
            : serviceDisruptionPatientEntity.patientName;
        this.patientNumber = serviceDisruptionPatientEntity.patientNumber
            ? serviceDisruptionPatientEntity.patientNumber.trim()
            : serviceDisruptionPatientEntity.patientNumber;
        this.time = serviceDisruptionPatientEntity.time;
        this.comments = serviceDisruptionPatientEntity.comments
            ? serviceDisruptionPatientEntity.comments.trim()
            : serviceDisruptionPatientEntity.comments;
        this.delayPeriod = serviceDisruptionPatientEntity.delayPeriod
            ? serviceDisruptionPatientEntity.delayPeriod.trim()
            : serviceDisruptionPatientEntity.delayPeriod;
        this.serviceDisruptionId = serviceDisruptionPatientEntity.serviceDisruptionId;
    }

    static create(serviceDisruptionPatientEntity) {
        return new ServiceDisruptionPatientEntity(serviceDisruptionPatientEntity);
    }

    static publicFields(serviceDisruptionPatientEntity) {
        return {
            ...new ServiceDisruptionPatientEntity(serviceDisruptionPatientEntity),
            ...new ServiceDisruptionEntity(serviceDisruptionPatientEntity)
        };
    }
}
