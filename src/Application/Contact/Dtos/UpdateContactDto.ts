import type {IContactEntity} from "@entities/Contact/ContactEntity";
import type {IFacilityEntity} from "@entities/Facility/FacilityEntity";
import type {IProcessEntity} from "@entities/Process/ProcessEntity";
import type {ReplaceKeys} from "@typings/Misc";

type TUpdateContactDto = Pick<IContactEntity, "contactId"> &
    Partial<
        ReplaceKeys<
            Pick<IFacilityEntity, "facilityId"> &
                Pick<IProcessEntity, "processId"> &
                Pick<IContactEntity, "firstName" | "lastName" | "email" | "type" | "adminId">,
            "facilityId" | "processId",
            {
                facilityId: string | string[];
                processId: string | string[];
            }
        >
    >;

export interface UpdateContactDto extends TUpdateContactDto {}

export class UpdateContactDto {
    constructor(body: TUpdateContactDto) {
        this.contactId = body.contactId;
        this.adminId = body.adminId as string;
        this.firstName = body.firstName as string;
        this.lastName = body.lastName as string;
        this.email = body.email as string;
        this.type = body.type as string;
        this.facilityId = body.facilityId as string | string[];
        this.processId = body.processId as string | string[];
    }

    static create(body: unknown) {
        return new UpdateContactDto(body as TUpdateContactDto);
    }
}
