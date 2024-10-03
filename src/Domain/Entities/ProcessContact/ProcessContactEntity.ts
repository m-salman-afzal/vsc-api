import type {ContactEntity} from "@entities/Contact/ContactEntity";

export interface IProcessContactEntity {
    id: number;
    processContactId: string;
    processId: string;
    contactId: string;
    contact?: ContactEntity;
}

export interface ProcessContactEntity extends IProcessContactEntity {}

export class ProcessContactEntity {
    constructor(processContactsEntity: IProcessContactEntity) {
        this.processContactId = processContactsEntity.processContactId;
        this.processId = processContactsEntity.processId;
        this.contactId = processContactsEntity.contactId;
    }

    static create(processContactsEntity) {
        return new ProcessContactEntity(processContactsEntity);
    }
}
