import type {ProcessContactEntity} from "@entities/ProcessContact/ProcessContactEntity";

export interface IProcessEntity {
    id: number;
    processId: string;
    processName: string;
    processLabel: string;
    time: string;
    type: string;
    method: string;
    processContacts?: ProcessContactEntity[];
}

export interface ProcessEntity extends IProcessEntity {}

export class ProcessEntity {
    constructor(processEntity: IProcessEntity) {
        this.processId = processEntity.processId;
        this.processName = processEntity.processName ? processEntity.processName.trim() : processEntity.processName;
        this.processLabel = processEntity.processLabel ? processEntity.processLabel.trim() : processEntity.processLabel;
        this.time = processEntity.time;
        this.method = processEntity.method;
        this.type = processEntity.type;
    }

    static create(processEntity) {
        return new ProcessEntity(processEntity);
    }
}
