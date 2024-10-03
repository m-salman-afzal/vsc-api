import type {ContactEntity} from "@entities/Contact/ContactEntity";
import type {FacilityEntity} from "@entities/Facility/FacilityEntity";

export interface IFacilityContactEntity {
    facilityContactId: string;
    contactId: string;
    facilityId: string;

    facility?: FacilityEntity;
    contact?: ContactEntity;
}

export interface FacilityContactEntity extends IFacilityContactEntity {}

export class FacilityContactEntity {
    constructor(facilityEntity: IFacilityContactEntity) {
        this.facilityContactId = facilityEntity.facilityContactId;
        this.facilityId = facilityEntity.facilityId;
        this.contactId = facilityEntity.contactId;
    }

    static create(facilityEntity) {
        return new FacilityContactEntity(facilityEntity);
    }
}
