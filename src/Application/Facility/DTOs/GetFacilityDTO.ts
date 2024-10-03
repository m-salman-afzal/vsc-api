import type {IFacilityEntity} from "@entities/Facility/FacilityEntity";
import type {ReplaceKeys} from "@typings/Misc";

type TGetFacilityDTO = ReplaceKeys<
    Partial<Pick<IFacilityEntity, "facilityId" | "facilityName" | "externalFacilityId" | "id"> & {text: string}>,
    "facilityId" | "externalFacilityId",
    {facilityId: string | string[]; externalFacilityId: string | string[]}
>;

export interface GetFacilityDTO extends TGetFacilityDTO {}

export class GetFacilityDTO {
    private constructor(body: TGetFacilityDTO) {
        const text = body.text?.trim() as string;

        this.facilityId = body.facilityId as string | string[];
        this.facilityName = text;
        this.externalFacilityId = text;
        this.id = text as unknown as number;
    }

    static create(body: TGetFacilityDTO): GetFacilityDTO {
        return new GetFacilityDTO(body);
    }
}
