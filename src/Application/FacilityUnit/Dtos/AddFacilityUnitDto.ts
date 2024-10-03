import type {IFacilityUnitEntity} from "@entities/FacilityUnit/FacilityUnitEntity";

type TAddFacilityUnitDto = Partial<IFacilityUnitEntity>;

export interface AddFacilityUnitDto extends TAddFacilityUnitDto {}

export class AddFacilityUnitDto {
    constructor(body: TAddFacilityUnitDto) {
        this.facilityUnitId = body.facilityUnitId as string;
        this.facilityId = body.facilityId as string;
        this.location = body.location as string;
        this.unit = body.unit as string;
        this.cell = body.cell as string;
        this.bed = body.bed as string;
        this.drugCount = body.drugCount as number;
        this.patientCount = body.patientCount as number;
        this.quantity = body.quantity as number;
    }

    static create(body: unknown) {
        return new AddFacilityUnitDto(body as TAddFacilityUnitDto);
    }
}
