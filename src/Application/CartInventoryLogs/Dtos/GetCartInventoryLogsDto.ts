import type {TCartInventoryLogsEntity} from "@entities/CartInventoryLogs/CartInventoryLogsEntity";

type TGetCartInventoryLogsDto = Pick<TCartInventoryLogsEntity, "facilityId"> & {
    cart?: string;
    fromDate?: string;
    toDate?: string;
};

export interface GetCartInventoryLogsDto extends TGetCartInventoryLogsDto {}

export class GetCartInventoryLogsDto {
    constructor(body: TGetCartInventoryLogsDto) {
        this.cart = body.cart as string;
        this.fromDate = body.fromDate as string;
        this.toDate = body.toDate as string;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new GetCartInventoryLogsDto(body as TGetCartInventoryLogsDto);
    }
}
