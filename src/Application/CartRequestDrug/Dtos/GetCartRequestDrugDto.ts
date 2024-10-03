import type {ICartRequestDrugEntity} from "@entities/CartRequestDrug/CartRequestDrugEntity";

type TGetCartRequestDrugDto = Partial<
    Pick<
        ICartRequestDrugEntity,
        "cartRequestLogId" | "cartRequestAllocationLogId" | "cartRequestDeletionLogId" | "cartRequestPickLogId"
    >
> & {
    isRequestLog: boolean;
    cartRequestLogType: string;
};

export interface GetCartRequestDrugDto extends TGetCartRequestDrugDto {}

export class GetCartRequestDrugDto {
    constructor(body: TGetCartRequestDrugDto) {
        this.cartRequestLogId = body.cartRequestLogId as string;
        this.cartRequestAllocationLogId = body.cartRequestAllocationLogId as string;
        this.cartRequestDeletionLogId = body.cartRequestDeletionLogId as string;
        this.cartRequestPickLogId = body.cartRequestPickLogId as string;
        this.isRequestLog = (body.isRequestLog ? body.isRequestLog === ("true" as never) : null) as boolean;
        this.cartRequestLogType = body.cartRequestLogType as string;
    }

    static create(body: unknown) {
        return new GetCartRequestDrugDto(body as TGetCartRequestDrugDto);
    }
}
