import type {IContactEntity} from "@entities/Contact/ContactEntity";
import type {IFacilityContactEntity} from "@entities/FacilityContact/FacilityContactEntity";

type TGetFacilityContactDto = Partial<IFacilityContactEntity & IContactEntity>;

export interface GetFacilityContactDto extends TGetFacilityContactDto {}

export class GetFacilityContactDto {
    private constructor(body: TGetFacilityContactDto) {
        this.facilityContactId = body.facilityContactId as string;
        this.facilityId = body.facilityId as string;
        this.contactId = body.contactId as string;
    }

    static create(body: unknown) {
        return new GetFacilityContactDto(body as TGetFacilityContactDto);
    }
}
