import type {PerpetualInventoryEntity} from "@entities/PerpetualInventory/PerpetualInventoryEntity";

type TAddPerpetualDeductionDto = {
    perpetualInventoryId: string;
    quantityDeducted: number;
    patientName: string;
    providerName: string;
    date: string;
    time: string;
    adminId: string;
    type: string;
    comment: string;
    adminName: string;
    witnessName: string;
    nurseName: string;
    signatureImages: {adminSignature: string; witnessSignature: string; nurseSignature: string};
    perpetualInventoryEntity: PerpetualInventoryEntity;
};
export interface AddPerpetualDeductionDto extends TAddPerpetualDeductionDto {}

export class AddPerpetualDeductionDto {
    private constructor(body: TAddPerpetualDeductionDto) {
        this.patientName = body.patientName;
        this.providerName = body.providerName;
        this.time = body.time;
        this.date = body.date;
        this.quantityDeducted = body.quantityDeducted;
        this.perpetualInventoryId = body.perpetualInventoryId;
        this.adminId = body.adminId;
        this.type = body.type;
        this.comment = body.comment;
        this.adminName = body.adminName;
        this.witnessName = body.witnessName;
        this.nurseName = body.nurseName;
        this.signatureImages = body.signatureImages;
        this.perpetualInventoryEntity = body.perpetualInventoryEntity;
    }

    static create(body: unknown) {
        return new AddPerpetualDeductionDto(body as TAddPerpetualDeductionDto);
    }
}
