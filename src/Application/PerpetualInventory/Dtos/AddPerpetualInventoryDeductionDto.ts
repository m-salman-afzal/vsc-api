import type {AddPerpetualInventoryDto} from "./AddPerpetualInventoryDto";

type TAddPerpetualInventoryDeductionDto = {
    perpetualInventory?: AddPerpetualInventoryDto;
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
    cartId: string;
};
export interface AddPerpetualInventoryDeductionDto extends TAddPerpetualInventoryDeductionDto {}

export class AddPerpetualInventoryDeductionDto {
    private constructor(body: TAddPerpetualInventoryDeductionDto) {
        this.perpetualInventory = body.perpetualInventory as AddPerpetualInventoryDto;
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
        this.cartId = body.cartId;
    }

    static create(body: unknown) {
        return new AddPerpetualInventoryDeductionDto(body as TAddPerpetualInventoryDeductionDto);
    }
}
