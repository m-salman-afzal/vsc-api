import type {IProcessContactEntity} from "@entities/ProcessContact/ProcessContactEntity";

type TUpdateProcessContactDto = Partial<
    Pick<IProcessContactEntity, "processContactId" | "contactId"> & {
        processId: string | string[];
        contactId: string;
        isAdd: boolean;
    }
>;

export interface UpdateProcessContactDto extends TUpdateProcessContactDto {}

export class UpdateProcessContactDto {
    constructor(body: TUpdateProcessContactDto) {
        this.processContactId = body.processContactId as string;
        this.processId = body.processId as string;
        this.contactId = body.contactId as string;
    }

    static create(body: unknown) {
        return new UpdateProcessContactDto(body as TUpdateProcessContactDto);
    }
}
