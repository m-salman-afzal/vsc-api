import type {IProcessContactEntity} from "@entities/ProcessContact/ProcessContactEntity";

type TGetProcessContactDto = Partial<Pick<IProcessContactEntity, "processId" | "contactId" | "processContactId">>;

export interface GetProcessContactDto extends TGetProcessContactDto {}

export class GetProcessContactDto {
    private constructor(body: TGetProcessContactDto) {
        this.processContactId = body.processContactId as string;
        this.contactId = body.contactId as string;
        this.processId = body.processId as string;
    }

    static create(body: unknown) {
        return new GetProcessContactDto(body as TGetProcessContactDto);
    }
}
