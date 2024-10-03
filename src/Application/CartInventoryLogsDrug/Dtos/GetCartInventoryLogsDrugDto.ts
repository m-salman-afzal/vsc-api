import type {TCartInventoryLogsDrugEntity} from "@entities/CartInventoryLogsDrug/CartInventoryLogsDrugEntity";

type TGetCartInventoryLogsDrugDto = Pick<TCartInventoryLogsDrugEntity, "cartInventoryLogsId">;

export interface GetCartInventoryLogsDrugDto extends TGetCartInventoryLogsDrugDto {}

export class GetCartInventoryLogsDrugDto {
    constructor(body: TGetCartInventoryLogsDrugDto) {
        this.cartInventoryLogsId = body.cartInventoryLogsId;
    }

    static create(body: unknown) {
        return new GetCartInventoryLogsDrugDto(body as TGetCartInventoryLogsDrugDto);
    }
}
