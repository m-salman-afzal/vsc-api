import type {IInventoryEntity} from "@entities/Inventory/InventoryEntity";

type TGetControlledIdDto = Partial<Pick<IInventoryEntity, "facilityId" | "formularyId">>;

export interface GetControlledIdDto extends TGetControlledIdDto {}

export class GetControlledIdDto {
    constructor(body: TGetControlledIdDto) {
        this.facilityId = body.facilityId as string;
        this.formularyId = body.formularyId as string;
    }

    static create(body: unknown) {
        return new GetControlledIdDto(body as TGetControlledIdDto);
    }
}
