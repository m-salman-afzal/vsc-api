import type {IFacilityEntity} from "@entities/Facility/FacilityEntity";

type TUpdateFacilityDTO = Pick<IFacilityEntity, "facilityId"> &
    Partial<Pick<IFacilityEntity, "facilityName" | "externalFacilityId" | "address" | "population" | "launchDate">>;

export interface UpdateFacilityDTO extends TUpdateFacilityDTO {}

export class UpdateFacilityDTO {
    constructor(body: TUpdateFacilityDTO) {
        this.facilityId = body.facilityId;
        this.facilityName = body.facilityName as string;
        this.address = body.address as string;
        this.population = body.population as number;
        this.launchDate = body.launchDate as string;
    }

    static create(body: TUpdateFacilityDTO): UpdateFacilityDTO {
        return new UpdateFacilityDTO(body);
    }
}
