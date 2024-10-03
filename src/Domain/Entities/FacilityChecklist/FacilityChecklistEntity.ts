import type {AdminEntity} from "@entities/Admin/AdminEntity";
import type {FacilityEntity} from "@entities/Facility/FacilityEntity";

export interface IFacilityChecklistEntity {
    facilityChecklistId: string;
    event: string;
    priority: number;
    adminId: string;
    facilityId: string;
    admin?: AdminEntity;
    facility?: FacilityEntity;
}

export interface FacilityChecklistEntity extends IFacilityChecklistEntity {}

export class FacilityChecklistEntity {
    constructor(facilityChecklistEntity: IFacilityChecklistEntity) {
        this.facilityChecklistId = facilityChecklistEntity.facilityChecklistId;
        this.adminId = facilityChecklistEntity.adminId;
        this.priority = facilityChecklistEntity.priority;
        this.facilityId = facilityChecklistEntity.facilityId;
        this.event = facilityChecklistEntity.event;
    }

    static create(facilityChecklistEntity) {
        return new FacilityChecklistEntity(facilityChecklistEntity);
    }
}
