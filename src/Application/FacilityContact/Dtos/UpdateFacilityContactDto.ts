import type {IFacilityContactEntity} from "@entities/FacilityContact/FacilityContactEntity";

type TUpdateFacilityContactDto = Partial<
    Pick<IFacilityContactEntity, "facilityContactId"> & {
        facilityId: string | string[];
        contactId: string;
        isAdd: boolean;
    }
>;

export interface UpdateFacilityContactDto extends TUpdateFacilityContactDto {}

export class UpdateFacilityContactDto {
    constructor(body: TUpdateFacilityContactDto) {
        this.facilityContactId = body.facilityContactId as string;
        this.contactId = body.contactId as string;
        this.facilityId = body.facilityId as string;
    }

    static create(body: unknown) {
        return new UpdateFacilityContactDto(body as TUpdateFacilityContactDto);
    }
}
