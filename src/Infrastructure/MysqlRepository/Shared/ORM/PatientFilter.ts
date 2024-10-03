import {Between, In, LessThan, Like} from "typeorm";

import type {IPatientEntity} from "@entities/Patient/PatientEntity";
import type {Patient} from "@infrastructure/Database/Models/Patient";
import type {ReplaceKeys} from "@typings/Misc";
import type {TWhereFilter} from "@typings/ORM";

type TFilterPatient = ReplaceKeys<
    Partial<IPatientEntity>,
    "patientId" | "externalPatientId" | "jmsId",
    {patientId: string | string[]; externalPatientId: string | string[]; jmsId: string | string[]}
> & {
    toDate?: string;
    fromDate?: string;
};

type TWherePatient = TWhereFilter<Patient>;

export class PatientFilter {
    private where: TWherePatient;
    constructor(filters: TFilterPatient) {
        this.where = {};

        this.setPatientId(filters);
        this.setExternalPatientId(filters);
        this.setJmsId(filters);
        this.setName(filters);
        this.setStatus(filters);
        this.setFacilityId(filters);
        this.setLastReleaseDate(filters);
        this.setBookedDate(filters);
    }

    static setFilter(filters: TFilterPatient) {
        return new PatientFilter(filters).where;
    }

    setPatientId(filters: TFilterPatient) {
        if (Array.isArray(filters.patientId)) {
            this.where.patientId = In(filters.patientId);

            return;
        }

        if (filters.patientId) {
            this.where.patientId = filters.patientId;
        }
    }

    setExternalPatientId(filters: TFilterPatient) {
        if (Array.isArray(filters.externalPatientId)) {
            this.where.externalPatientId = In(filters.externalPatientId);

            return;
        }

        if (filters.externalPatientId) {
            this.where.externalPatientId = filters.externalPatientId;
        }
    }

    setJmsId(filters: TFilterPatient) {
        if (Array.isArray(filters.jmsId)) {
            this.where.jmsId = In(filters.jmsId);

            return;
        }

        if (filters.jmsId) {
            this.where.jmsId = filters.jmsId;
        }
    }

    setName(filters: TFilterPatient) {
        if (filters.name) {
            this.where.name = Like(`%${filters.name}%`);
        }
    }

    setStatus(filters: TFilterPatient) {
        if (filters.status) {
            this.where.status = filters.status;
        }
    }

    setFacilityId(filters: TFilterPatient) {
        if (filters.facilityId) {
            this.where.facilityId = filters.facilityId;
        }
    }

    setLastReleaseDate(filters: TFilterPatient) {
        if (filters.fromDate && filters.toDate) {
            this.where.lastReleaseDate = Between(`${filters.fromDate} 00:00:00`, `${filters.toDate} 23:59:59`);
        }
    }

    setBookedDate(filters: TFilterPatient) {
        if (filters.lastBookedDate) {
            this.where.lastBookedDate = LessThan(`${filters.lastBookedDate} 00:00:00`);
        }
    }
}
