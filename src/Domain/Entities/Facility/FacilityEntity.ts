import {FACILITY_SUPPLY_DAYS} from "@constants/FacilityConstant";

import SharedUtils from "@appUtils/SharedUtils";

import type {ContactEntity} from "@entities/Contact/ContactEntity";
import type {FacilityAdminEntity} from "@entities/FacilityAdmin/FacilityAdminEntity";
import type {SafeReportEntity} from "@entities/SafeReport/SafeReportEntity";

export interface IFacilityEntity {
    id?: number;
    facilityId: string;
    facilityName: string;
    externalFacilityId: string;
    externalGroupId: string;
    address: string;
    population: number;
    supplyDays: number;
    launchDate?: string;
    key?: string;
    contact?: ContactEntity[];
    idFacility?: number;
    facilityAdmin?: FacilityAdminEntity[];
    safeReport?: SafeReportEntity[];
    staffCount?: number;
    unitsCount?: number;
}

export interface FacilityEntity extends IFacilityEntity {}

export class FacilityEntity {
    constructor(facilityEntity: IFacilityEntity) {
        this.facilityId = facilityEntity.facilityId;
        this.facilityName = facilityEntity.facilityName
            ? facilityEntity.facilityName.trim()
            : facilityEntity.facilityName;
        this.externalFacilityId = facilityEntity.externalFacilityId
            ? facilityEntity.externalFacilityId.trim()
            : facilityEntity.externalFacilityId;
        this.externalGroupId = facilityEntity.externalGroupId
            ? facilityEntity.externalGroupId.trim()
            : facilityEntity.externalGroupId;
        this.address = facilityEntity.address ? facilityEntity.address.trim() : facilityEntity.address;
        this.population = facilityEntity.population;
        this.supplyDays = facilityEntity.supplyDays ?? FACILITY_SUPPLY_DAYS.SEVEN_DAYS;
        this.launchDate = facilityEntity.launchDate
            ? SharedUtils.setDate(facilityEntity.launchDate)
            : (facilityEntity.launchDate as string);
    }

    static create(facilityEntity) {
        return new FacilityEntity(facilityEntity);
    }

    static publicFields(facilityEntity) {
        const facility = new FacilityEntity(facilityEntity);
        facility.id = facilityEntity.idFacility;
        facility.key = facilityEntity.facilityId;
        facility.staffCount = facilityEntity.staffCount ?? 0;

        return facility;
    }
}
