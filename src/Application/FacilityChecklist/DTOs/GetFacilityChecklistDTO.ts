import type {IFacilityChecklistEntity} from "@entities/FacilityChecklist/FacilityChecklistEntity";

type TGetFacilityChecklistDTO = Partial<Pick<IFacilityChecklistEntity, "facilityId" | "adminId">>;

export interface GetFacilityChecklistDTO extends TGetFacilityChecklistDTO {}

export class GetFacilityChecklistDTO {
    constructor(body: TGetFacilityChecklistDTO) {
        this.adminId = body.adminId as string;
        this.facilityId = body.facilityId as string;
    }

    static create(body: unknown): GetFacilityChecklistDTO {
        return new GetFacilityChecklistDTO(body as TGetFacilityChecklistDTO);
    }
}
