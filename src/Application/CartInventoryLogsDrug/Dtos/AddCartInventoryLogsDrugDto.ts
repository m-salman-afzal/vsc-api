import type {TCartInventoryLogsDrugEntity} from "@entities/CartInventoryLogsDrug/CartInventoryLogsDrugEntity";

type TAddCartInventoryLogsDrugDto = Pick<TCartInventoryLogsDrugEntity, "facilityId"> & {
    cartId: string;
    cartInventoryLogsId: string;
};

export interface AddCartInventoryLogsDrugDto extends TAddCartInventoryLogsDrugDto {}

export class AddCartInventoryLogsDrugDto {
    constructor(body: TAddCartInventoryLogsDrugDto) {
        this.cartId = body.cartId;
        this.facilityId = body.facilityId;
        this.cartInventoryLogsId = body.cartInventoryLogsId;
    }

    static create(body: unknown) {
        return new AddCartInventoryLogsDrugDto(body as TAddCartInventoryLogsDrugDto);
    }
}
