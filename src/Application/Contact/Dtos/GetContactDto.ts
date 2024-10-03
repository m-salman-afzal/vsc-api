import type {IContactEntity} from "@entities/Contact/ContactEntity";
import type {IFacilityEntity} from "@entities/Facility/FacilityEntity";
import type {IProcessEntity} from "@entities/Process/ProcessEntity";
import type {ReplaceKeys} from "@typings/Misc";

type TGetContactDto = ReplaceKeys<
    Partial<
        IContactEntity &
            IProcessEntity &
            IFacilityEntity & {
                searchText: string;
            }
    >,
    "facilityName",
    {
        facilityName: string | string[];
    }
>;

export interface GetContactDto extends TGetContactDto {}

export class GetContactDto {
    private constructor(body: TGetContactDto) {
        this.contactId = body.contactId as string;
        this.adminId = body.adminId as string;
        this.email = body.searchText as string;
        this.firstName = body.searchText as string;
        this.lastName = body.searchText as string;
        this.type = body.type as string;
        this.facilityId = body.facilityId as string;
        this.facilityName = body.facilityName as string | string[];
        this.processId = body.processId as string;
    }

    static create(body: unknown) {
        return new GetContactDto(body as TGetContactDto);
    }
}
