import type {IShiftCountEntity} from "@entities/ShiftCount/ShiftCountEntity";

type TGetShiftCountDto = Pick<IShiftCountEntity, "cartId" | "facilityId" | "name">;

export interface GetShiftCountDto extends TGetShiftCountDto {}

export class GetShiftCountDto {
    private constructor(body: TGetShiftCountDto) {
        this.cartId = body.cartId;
        this.facilityId = body.facilityId;
        this.name = body.name;
    }

    static create(body: unknown) {
        return new GetShiftCountDto(body as TGetShiftCountDto);
    }
}
