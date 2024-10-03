import type {ICartRequestLogEntity} from "@entities/CartRequestLog/CartRequestLogEntity";

type TGetCartRequestLogDto = Partial<
    Pick<ICartRequestLogEntity, "facilityId" | "adminId"> & {
        fromDate: string;
        toDate: string;
        cartId: string;
        text: string;
        type: string | string[];
    }
>;

export interface GetCartRequestLogDto extends TGetCartRequestLogDto {}

export class GetCartRequestLogDto {
    constructor(body: TGetCartRequestLogDto) {
        this.type = body.type as string | string[];
        this.fromDate = body.fromDate as string;
        this.toDate = body.toDate as string;
        this.adminId = body.adminId as string;
        this.facilityId = body.facilityId as string;
        this.cartId = body.cartId as string;
        this.text = body.text as string;
    }

    static create(body: unknown) {
        return new GetCartRequestLogDto(body as TGetCartRequestLogDto);
    }
}
