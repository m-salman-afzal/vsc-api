import type {IInventoryEntity} from "@entities/Inventory/InventoryEntity";

type TGetInventorySuggestionDto = Partial<Pick<IInventoryEntity, "formularyId">>;

export interface GetInventorySuggestionDto extends TGetInventorySuggestionDto {}

export class GetInventorySuggestionDto {
    constructor(body: TGetInventorySuggestionDto) {
        this.formularyId = body.formularyId as string;
    }

    static create(body: unknown) {
        return new GetInventorySuggestionDto(body as TGetInventorySuggestionDto);
    }
}
