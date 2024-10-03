import type {IInventoryControlEntity} from "@entities/InventoryControl/InventoryControlEntity";

type TAddInventoryControlDto = Pick<
    IInventoryControlEntity,
    "receiverName" | "witnessName" | "facilityId" | "inventoryId"
> & {
    signature: {receiverSignature: string; witnessSignature: string};
};

export interface AddInventoryControlDto extends TAddInventoryControlDto {}

export class AddInventoryControlDto {
    constructor(body: TAddInventoryControlDto) {
        this.receiverName = body.receiverName;
        this.witnessName = body.witnessName;
        this.signature = body.signature;
        this.facilityId = body.facilityId;
        this.inventoryId = body.inventoryId;
    }

    static create(body: unknown) {
        return new AddInventoryControlDto(body as TAddInventoryControlDto);
    }
}
