export type TRequestForm = {
    cartRequestFormId: string;
    pendingOrderQuantity: number;
    packageQuantity: number;
    cartId?: string;
    referenceGuideDrugId: string;
    formularyId: string;
};
type TUpsertCartRequestFormDto = {
    requestForm: TRequestForm[];
    type: string;
    controlledId: string;
    controlledType?: string;
    tr?: string;
    receiverName: string;
    witnessName: string;
    signatureImages: {receiverSignatureImage: string; witnessSignatureImage: string};
    facilityId: string;
};

export interface UpsertCartRequestFormDto extends TUpsertCartRequestFormDto {}

export class UpsertCartRequestFormDto {
    private constructor(body: TUpsertCartRequestFormDto) {
        this.requestForm = body.requestForm.map((b) => ({
            cartRequestFormId: b.cartRequestFormId,
            pendingOrderQuantity: b.pendingOrderQuantity,
            packageQuantity: b.packageQuantity,
            formularyId: b.formularyId,
            cartId: b.cartId as string,
            referenceGuideDrugId: b.referenceGuideDrugId
        }));

        this.type = body.type;
        this.tr = body.tr as string;
        this.controlledId = body.controlledId;
        this.controlledType = body.controlledType as string;
        this.receiverName = body.receiverName;
        this.witnessName = body.witnessName;
        this.signatureImages = body.signatureImages;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new UpsertCartRequestFormDto(body as TUpsertCartRequestFormDto);
    }
}
