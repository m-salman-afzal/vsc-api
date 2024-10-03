import type {IFileEntity} from "@entities/File/FileEntity";

type TUpdateFileDto = Pick<IFileEntity, "fileId"> & Partial<Pick<IFileEntity, "status">>;

export interface UpdateFileDto extends TUpdateFileDto {}

export class UpdateFileDto {
    constructor(body: TUpdateFileDto) {
        this.fileId = body.fileId;
        this.status = body.status as string;
    }

    static create(body: TUpdateFileDto) {
        return new UpdateFileDto(body);
    }
}
