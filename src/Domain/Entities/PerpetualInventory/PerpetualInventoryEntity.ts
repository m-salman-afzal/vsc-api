import SharedUtils from "@appUtils/SharedUtils";

import type {PerpetualInventoryDeductionEntity} from "@entities/PerpetualInventoryDeduction/PerpetualInventoryDeductionEntity";

export interface IPerpetualInventoryEntity {
    perpetualInventoryId: string;
    rowNumber: number;
    controlledId: string;
    tr: string;
    rx: string;
    name: string;
    patientName: string;
    providerName: string;
    staffSignature: string;
    quantityAllocated: number;
    isModified: boolean;
    cartRequestDeductionId: string;
    facilityId: string;
    controlledDrugId: string;
    cartId: string;
    staffName: string;
    isPatientSpecific: boolean;
    isArchived: boolean;

    createdAt?: string;
    perpetualInventoryDeduction?: PerpetualInventoryDeductionEntity[];
}

export interface PerpetualInventoryEntity extends IPerpetualInventoryEntity {}

export class PerpetualInventoryEntity {
    private constructor(piEntity: IPerpetualInventoryEntity) {
        this.perpetualInventoryId = piEntity.perpetualInventoryId;
        this.rx = piEntity.rx;
        this.tr = piEntity.tr;
        this.rowNumber = piEntity.rowNumber;
        this.controlledId = piEntity.controlledId;
        this.name = piEntity.name;
        this.patientName = piEntity.patientName;
        this.providerName = piEntity.providerName;
        this.staffSignature = piEntity.staffSignature;
        this.quantityAllocated = piEntity.quantityAllocated;
        this.isModified = piEntity.isModified;
        this.cartRequestDeductionId = piEntity.cartRequestDeductionId;
        this.facilityId = piEntity.facilityId;
        this.controlledDrugId = piEntity.controlledDrugId;
        this.cartId = piEntity.cartId;
        this.staffName = piEntity.staffName;
        this.isPatientSpecific = piEntity.isPatientSpecific;
        this.isArchived = piEntity.isArchived;
    }

    static create(body: unknown) {
        return new PerpetualInventoryEntity(body as IPerpetualInventoryEntity);
    }

    static publicFields(body: unknown) {
        const entity = PerpetualInventoryEntity.create(body);
        const {date, time} = SharedUtils.setDateTime((body as IPerpetualInventoryEntity).createdAt as string);
        entity.createdAt = `${date} ${time}`;

        return entity;
    }
}
