type TGetPerpetualInventorySignatureDto = {
    perpetualInventoryId: string;
    perpetualInventoryDeductionId: string;
    facilityId: string;
    signatureType: string;
};

export interface GetPerpetualInventorySignatureDto extends TGetPerpetualInventorySignatureDto {}

export class GetPerpetualInventorySignatureDto {
    private constructor(body: TGetPerpetualInventorySignatureDto) {
        this.perpetualInventoryId = body.perpetualInventoryId;
        this.perpetualInventoryDeductionId = body.perpetualInventoryDeductionId;
        this.facilityId = body.facilityId;
        this.signatureType = body.signatureType;
    }

    static create(body: unknown) {
        return new GetPerpetualInventorySignatureDto(body as TGetPerpetualInventorySignatureDto);
    }
}
