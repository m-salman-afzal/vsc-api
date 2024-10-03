type TUpdateCartAllocationDto = {
    cartRequestDrugId: string[];
    allocationStatus: string;

    type: string;
    controlledId: string;
    tr?: string;
    controlledType: string;
    receiverName: string;
    witnessName: string;
    signatureImages: {receiverSignatureImage: string; witnessSignatureImage: string};
    facilityId: string;
    undo?: boolean;
};

export interface UpdateCartAllocationDto extends TUpdateCartAllocationDto {}

export class UpdateCartAllocationDto {
    private constructor(body: TUpdateCartAllocationDto) {
        this.cartRequestDrugId = body.cartRequestDrugId;
        this.allocationStatus = body.allocationStatus;

        this.type = body.type;
        this.controlledId = body.controlledId;
        this.receiverName = body.receiverName;
        this.witnessName = body.witnessName;
        this.signatureImages = body.signatureImages;
        this.facilityId = body.facilityId;
        this.tr = body.tr as string;
        this.undo = body.undo as boolean;
    }

    static create(body: unknown) {
        return new UpdateCartAllocationDto(body as TUpdateCartAllocationDto);
    }
}
