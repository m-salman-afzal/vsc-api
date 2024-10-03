import type {ICartRequestLogEntity} from "@entities/CartRequestLog/CartRequestLogEntity";

type TAddCartRequestLogDto = Partial<
    Omit<
        ICartRequestLogEntity,
        "cartRequestLogId" | "witnessSignature" | "receiverSignature" | "cartId" | "controlledType"
    >
> & {
    signatureImages?: {receiverSignatureImage: string; witnessSignatureImage: string};
    cartId?: string;
    controlledType?: string;
    controlledId?: string;
};

export interface AddCartRequestLogDto extends TAddCartRequestLogDto {}

export class AddCartRequestLogDto {
    constructor(body: TAddCartRequestLogDto) {
        this.type = body.type as string;
        this.controlledType = body.controlledType as string;
        this.receiverName = body.receiverName as string;
        this.witnessName = body.witnessName as string;
        this.signatureImages = body.signatureImages as {receiverSignatureImage: string; witnessSignatureImage: string};
        this.cartId = body.cartId as string;
        this.adminId = body.adminId as string;
        this.controlledId = body.controlledId as string;
    }

    static create(body: unknown) {
        return new AddCartRequestLogDto(body as TAddCartRequestLogDto);
    }
}
