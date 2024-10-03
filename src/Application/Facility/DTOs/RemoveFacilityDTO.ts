import type {IFacilityEntity} from "@entities/Facility/FacilityEntity";

type TRemoveFacilityDTO = Pick<IFacilityEntity, "facilityId">;

export interface RemoveFacilityDTO extends TRemoveFacilityDTO {}

export class RemoveFacilityDTO {
    private constructor(body: TRemoveFacilityDTO) {
        this.facilityId = body.facilityId;
    }

    static create(body: TRemoveFacilityDTO): RemoveFacilityDTO {
        return new RemoveFacilityDTO(body);
    }
}
