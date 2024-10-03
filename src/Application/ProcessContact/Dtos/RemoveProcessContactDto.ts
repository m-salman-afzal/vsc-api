import type {IProcessContactEntity} from "@entities/ProcessContact/ProcessContactEntity";

type TRemoveProcessContactDto = Partial<Pick<IProcessContactEntity, "processContactId" | "processId" | "contactId">>;

export interface RemoveProcessContactDto extends TRemoveProcessContactDto {}

export class RemoveProcessContactDto {
    constructor(body: TRemoveProcessContactDto) {
        this.processContactId = body.processContactId as string;
        this.processId = body.processId as string;
        this.contactId = body.contactId as string;
    }

    static create(body: unknown) {
        return new RemoveProcessContactDto(body as TRemoveProcessContactDto);
    }
}
