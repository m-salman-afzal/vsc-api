import SharedUtils from "@appUtils/SharedUtils";

import type {AdminEntity} from "@entities/Admin/AdminEntity";

export interface IPerpetualInventoryDeductionEntity {
    perpetualInventoryDeductionId: string;
    patientName: string;
    providerName: string;
    comment: string;
    quantityDeducted: number;
    type: string;
    perpetualInventoryId: string;
    date: string;
    time: string;
    adminId: string;
    dateTime?: string;
    createdAt?: string;
    adminName: string;
    adminSignature: string;
    witnessName: string;
    witnessSignature: string;
    nurseName: string;
    nurseSignature: string;

    admin?: Partial<AdminEntity>;
}

export interface PerpetualInventoryDeductionEntity extends IPerpetualInventoryDeductionEntity {}

export class PerpetualInventoryDeductionEntity {
    private constructor(piEntity: IPerpetualInventoryDeductionEntity) {
        this.perpetualInventoryDeductionId = piEntity.perpetualInventoryDeductionId;
        this.patientName = piEntity.patientName;
        this.providerName = piEntity.providerName;
        this.comment = piEntity.comment;
        this.quantityDeducted = piEntity.quantityDeducted;
        this.type = piEntity.type;
        this.perpetualInventoryId = piEntity.perpetualInventoryId;
        this.date = piEntity.date;
        this.time = piEntity.time;
        this.adminId = piEntity.adminId;
        this.adminName = piEntity.adminName;
        this.adminSignature = piEntity.adminSignature;
        this.witnessName = piEntity.witnessName;
        this.witnessSignature = piEntity.witnessSignature;
        this.nurseName = piEntity.nurseName;
        this.nurseSignature = piEntity.nurseSignature;
    }

    static create(body: unknown) {
        return new PerpetualInventoryDeductionEntity(body as IPerpetualInventoryDeductionEntity);
    }

    static publicFields(body: unknown) {
        const entity = PerpetualInventoryDeductionEntity.create(body);
        const {date, time} = SharedUtils.setDateTime((body as IPerpetualInventoryDeductionEntity).createdAt as string);
        entity.dateTime = `${date} ${time}`;
        entity.createdAt = `${date} ${time}`;

        return entity;
    }
}
