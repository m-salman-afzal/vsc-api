import SharedUtils from "@appUtils/SharedUtils";

import type {FacilityEntity} from "@entities/Facility/FacilityEntity";
import type {FacilityContactEntity} from "@entities/FacilityContact/FacilityContactEntity";
import type {ProcessEntity} from "@entities/Process/ProcessEntity";
import type {ProcessContactEntity} from "@entities/ProcessContact/ProcessContactEntity";

export interface IContactEntity {
    id?: number;
    contactId: string;
    adminId: string;
    firstName: string;
    lastName: string;
    type: string;
    email: string;
    facilityId?: string;
    processId?: string;
    facilityContact?: FacilityContactEntity[];
    processContact: ProcessContactEntity[];
    process: ProcessEntity[];
    facility: FacilityEntity[];
    key?: string;
    idContact?: number;
}

export interface ContactEntity extends IContactEntity {}

export class ContactEntity {
    constructor(contactEntity: IContactEntity) {
        this.contactId = contactEntity.contactId;
        this.email = contactEntity.email ? contactEntity.email.trim() : contactEntity.email;
        this.firstName = contactEntity.firstName
            ? SharedUtils.toCapitalize(contactEntity.firstName)
            : contactEntity.firstName;
        this.lastName = contactEntity.lastName
            ? SharedUtils.toCapitalize(contactEntity.lastName)
            : contactEntity.lastName;
        this.type = contactEntity.type;
        this.adminId = contactEntity.adminId;
    }

    static create(contactEntity) {
        return new ContactEntity(contactEntity);
    }

    static publicFields(contactEntity) {
        const contact = new ContactEntity(contactEntity);
        contact.facilityId = contactEntity.facilityId;
        contact.key = contactEntity.contactId;
        contact.id = contactEntity.id ?? contactEntity.idContact;

        return contact;
    }
}
