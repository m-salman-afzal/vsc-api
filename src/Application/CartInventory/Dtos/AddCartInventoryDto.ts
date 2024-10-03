type TAddCartInventoryDto = {
    cartId: string;
    facilityId: string;
    countedBy: string;
    witnessName: string;
    comment: string;
    witnessSignature: string;
    countedBySignature: string;
};

export interface AddCartInventoryDto extends TAddCartInventoryDto {}

export class AddCartInventoryDto {
    private constructor(body: TAddCartInventoryDto) {
        this.cartId = body.cartId;
        this.facilityId = body.facilityId;
        this.countedBy = body.countedBy;
        this.witnessName = body.witnessName;
        this.comment = body.comment;
        this.witnessSignature = body.witnessSignature;
        this.countedBySignature = body.countedBySignature;
    }

    static create(body: unknown) {
        return new AddCartInventoryDto(body as TAddCartInventoryDto);
    }
}
