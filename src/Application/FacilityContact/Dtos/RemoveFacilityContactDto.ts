import type {IFacilityContactEntity} from "@entities/FacilityContact/FacilityContactEntity";

type TRemoveFacilityContactDto = Partial<
    Pick<IFacilityContactEntity, "facilityContactId" | "facilityId" | "contactId">
>;

export interface RemoveFacilityContactDto extends TRemoveFacilityContactDto {}

export class RemoveFacilityContactDto {
    private constructor(body: TRemoveFacilityContactDto) {
        this.facilityContactId = body.facilityContactId as string;
        this.contactId = body.contactId as string;
        this.facilityId = body.facilityId as string;
    }

    static create(body: unknown) {
        return new RemoveFacilityContactDto(body as TRemoveFacilityContactDto);
    }
}
