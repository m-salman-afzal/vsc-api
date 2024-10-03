import {FacilityEntity} from "@entities/Facility/FacilityEntity";

import type {AdminEntity} from "@entities/Admin/AdminEntity";

export interface IFacilityAdminEntity {
    facilityAdminId: string;
    facilityId: string;
    adminId: string;
    admin?: AdminEntity;
    facility?: FacilityEntity;
}

export interface FacilityAdminEntity extends IFacilityAdminEntity {}

export class FacilityAdminEntity {
    constructor(facilityAdminEntity: IFacilityAdminEntity) {
        this.facilityAdminId = facilityAdminEntity.facilityAdminId;
        this.adminId = facilityAdminEntity.adminId;
        this.facilityId = facilityAdminEntity.facilityId;
    }

    static create(facilityAdminEntity) {
        return new FacilityAdminEntity(facilityAdminEntity);
    }

    static publicFieldsFromAdmin(facilityAdminEntity: IFacilityAdminEntity) {
        const facilityAdmin = new FacilityAdminEntity(facilityAdminEntity);
        facilityAdmin.facility = FacilityEntity.create(facilityAdminEntity.facility);

        return facilityAdmin;
    }
}
