import type {IFacilityEntity} from "@entities/Facility/FacilityEntity";

type TAddFacilityDTO = Pick<IFacilityEntity, "facilityName" | "address" | "population" | "externalFacilityId"> &
    Partial<Pick<IFacilityEntity, "launchDate">>;

export interface AddFacilityDTO extends TAddFacilityDTO {}

export class AddFacilityDTO {
    constructor(body: TAddFacilityDTO) {
        this.facilityName = body.facilityName;
        this.address = body.address;
        this.population = body.population;
        this.launchDate = body.launchDate as string;
    }

    static create(body: TAddFacilityDTO): AddFacilityDTO {
        return new AddFacilityDTO(body);
    }
}
