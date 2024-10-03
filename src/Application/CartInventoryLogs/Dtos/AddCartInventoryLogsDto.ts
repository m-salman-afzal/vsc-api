import type {TCartInventoryLogsEntity} from "@entities/CartInventoryLogs/CartInventoryLogsEntity";

type TAddCartInventoryLogsDto = Pick<TCartInventoryLogsEntity, "facilityId"> & {
    cartId: string;
};

export interface AddCartInventoryLogsDto extends TAddCartInventoryLogsDto {}

export class AddCartInventoryLogsDto {
    constructor(body: TAddCartInventoryLogsDto) {
        this.cartId = body.cartId;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new AddCartInventoryLogsDto(body as TAddCartInventoryLogsDto);
    }
}
