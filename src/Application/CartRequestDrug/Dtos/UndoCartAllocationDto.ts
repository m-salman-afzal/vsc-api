import type {ICartRequestDrugEntity} from "@entities/CartRequestDrug/CartRequestDrugEntity";

type TUndoCartAllocationDto = Pick<ICartRequestDrugEntity, "cartRequestDrugId" | "cartRequestAllocationLogId">;

export interface UndoCartAllocationDto extends TUndoCartAllocationDto {}

export class UndoCartAllocationDto {
    private constructor(body: TUndoCartAllocationDto) {
        this.cartRequestDrugId = body.cartRequestDrugId;
        this.cartRequestAllocationLogId = body.cartRequestAllocationLogId;
    }

    static create(body: unknown) {
        return new UndoCartAllocationDto(body as TUndoCartAllocationDto);
    }
}
