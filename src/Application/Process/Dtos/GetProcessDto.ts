import type {IContactEntity} from "@entities/Contact/ContactEntity";
import type {IFacilityEntity} from "@entities/Facility/FacilityEntity";
import type {IProcessEntity} from "@entities/Process/ProcessEntity";

type TGetProcessDto = Partial<IProcessEntity> &
    Partial<{searchText: string}> &
    Partial<Pick<IFacilityEntity, "facilityName">> &
    Partial<Pick<IContactEntity, "type">>;

export interface GetProcessDto extends TGetProcessDto {}

export class GetProcessDto {
    constructor(body: TGetProcessDto) {
        this.processId = body.processId as string;
        this.processLabel = body.searchText as string;
        this.processName = body.searchText as string;
    }

    static create(body: unknown) {
        return new GetProcessDto(body as TGetProcessDto);
    }
}
