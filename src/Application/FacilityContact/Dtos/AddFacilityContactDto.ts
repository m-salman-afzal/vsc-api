import type {IContactEntity} from "@entities/Contact/ContactEntity";
import type {IFacilityContactEntity} from "@entities/FacilityContact/FacilityContactEntity";

type TAddFacilityContactDto = Partial<IFacilityContactEntity> & Partial<IContactEntity>;

export interface AddFacilityContactDto extends TAddFacilityContactDto {}

export class AddFacilityContactDto {
    constructor(body: TAddFacilityContactDto) {
        this.facilityContactId = body.facilityContactId as string;
        this.facilityId = body.facilityId as string;
        this.contactId = body.contactId as string;
    }

    static create(body: unknown) {
        return new AddFacilityContactDto(body as TAddFacilityContactDto);
    }
}
