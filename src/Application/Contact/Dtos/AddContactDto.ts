import type {IContactEntity} from "@entities/Contact/ContactEntity";
import type {IFacilityEntity} from "@entities/Facility/FacilityEntity";
import type {IProcessEntity} from "@entities/Process/ProcessEntity";
import type {ReplaceKeys} from "@typings/Misc";

type TAddContactDto = ReplaceKeys<
    Pick<IFacilityEntity, "facilityId"> & Pick<IProcessEntity, "processId">,
    "facilityId" | "processId",
    {
        facilityId: string | string[];
        processId: string | string[];
    }
> &
    Pick<IContactEntity, "firstName" | "lastName" | "email" | "type"> &
    Partial<Pick<IContactEntity, "adminId">>;

export interface AddContactDto extends TAddContactDto {}

export class AddContactDto {
    constructor(body: TAddContactDto) {
        this.adminId = body.adminId as string;
        this.email = body.email;
        this.firstName = body.firstName;
        this.lastName = body.lastName;
        this.type = body.type;
        this.facilityId = body.facilityId;
        this.processId = body.processId;
    }

    static create(body: unknown) {
        return new AddContactDto(body as TAddContactDto);
    }
}
