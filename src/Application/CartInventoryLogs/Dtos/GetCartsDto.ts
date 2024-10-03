import type {TCartInventoryLogsEntity} from "@entities/CartInventoryLogs/CartInventoryLogsEntity";

type TGetCartsDto = Pick<TCartInventoryLogsEntity, "facilityId">;

export interface GetCartsDto extends TGetCartsDto {}

export class GetCartsDto {
    constructor(body: TGetCartsDto) {
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new GetCartsDto(body as GetCartsDto);
    }
}
