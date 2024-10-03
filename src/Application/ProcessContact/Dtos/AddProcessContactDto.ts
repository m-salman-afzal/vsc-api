import type {IContactEntity} from "@entities/Contact/ContactEntity";
import type {IProcessContactEntity} from "@entities/ProcessContact/ProcessContactEntity";

type TAddProcessContactDto = Partial<Pick<IProcessContactEntity, "processId" | "contactId">> & Partial<IContactEntity>;

export interface AddProcessContactDto extends TAddProcessContactDto {}

export class AddProcessContactDto {
    constructor(body: TAddProcessContactDto) {
        this.processId = body.processId as string;
        this.contactId = body.contactId as string;
    }

    static create(body: unknown) {
        return new AddProcessContactDto(body as TAddProcessContactDto);
    }
}
