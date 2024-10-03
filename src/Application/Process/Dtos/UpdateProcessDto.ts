import type {IProcessEntity} from "@entities/Process/ProcessEntity";

type TUpdateProcessDto = Pick<IProcessEntity, "processId" | "type" | "time">;

export interface UpdateProcessDto extends TUpdateProcessDto {}

export class UpdateProcessDto {
    constructor(body: TUpdateProcessDto) {
        this.processId = body.processId as string;
        this.type = body.type;
        this.time = body.time as string;
    }

    static create(body: unknown) {
        return new UpdateProcessDto(body as TUpdateProcessDto);
    }
}
