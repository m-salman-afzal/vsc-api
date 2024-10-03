import type {IFacilityUnitEntity} from "@entities/FacilityUnit/FacilityUnitEntity";

type TGetFacilityUnitDto = Partial<IFacilityUnitEntity>;

export interface GetFacilityUnitDto extends TGetFacilityUnitDto {}

export class GetFacilityUnitDto {
    constructor(body: TGetFacilityUnitDto) {
        this.facilityId = body.facilityId as string;
        this.unit = body.unit as string;
    }

    static create(body: unknown) {
        return new GetFacilityUnitDto(body as TGetFacilityUnitDto);
    }
}
