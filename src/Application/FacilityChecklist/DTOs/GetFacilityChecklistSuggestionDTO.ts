import type {IFacilityChecklistEntity} from "@entities/FacilityChecklist/FacilityChecklistEntity";

type TGetFacilityChecklistSuggestionDTO = Partial<
    Pick<IFacilityChecklistEntity, "facilityId"> & {
        firstName: string;
        lastName: string;
        text: string;
    }
>;

export interface GetFacilityChecklistSuggestionDTO extends TGetFacilityChecklistSuggestionDTO {}

export class GetFacilityChecklistSuggestionDTO {
    constructor(body: TGetFacilityChecklistSuggestionDTO) {
        if (body.text && body.text.split(" ").length > 1) {
            const [firstName, lastName] = body.text.split(" ");
            this.firstName = firstName as string;
            this.lastName = lastName as string;
        } else {
            this.text = body.text as string;
        }

        this.facilityId = body.facilityId as string;
    }

    static create(body: unknown): GetFacilityChecklistSuggestionDTO {
        return new GetFacilityChecklistSuggestionDTO(body as TGetFacilityChecklistSuggestionDTO);
    }
}
