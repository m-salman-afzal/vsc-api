import type {IContactEntity} from "@entities/Contact/ContactEntity";

type TRemoveContactDto = Partial<Pick<IContactEntity, "contactId" | "adminId">>;

export interface RemoveContactDto extends TRemoveContactDto {}

export class RemoveContactDto {
    private constructor(body: TRemoveContactDto) {
        this.contactId = body.contactId as string;
        this.adminId = body.adminId as string;
    }

    static create(body: unknown) {
        return new RemoveContactDto(body as TRemoveContactDto);
    }
}
