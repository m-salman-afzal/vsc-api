import type {FacilityUnitEntity} from "@entities/FacilityUnit/FacilityUnitEntity";

export interface UpdateLocationDto {
    units: Pick<FacilityUnitEntity, "isHnP" | "isCart" | "facilityUnitId">[];
}

export class UpdateLocationDto {
    constructor(body: UpdateLocationDto) {
        this.units = body.units;
    }

    static create(body: unknown) {
        return new UpdateLocationDto(body as UpdateLocationDto);
    }
}
