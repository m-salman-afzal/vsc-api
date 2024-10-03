import type {IFileEntity} from "@entities/File/FileEntity";

type TDownloadFileDto = Pick<IFileEntity, "fileId" | "isEf">;

export interface DownloadFileDto extends TDownloadFileDto {}

export class DownloadFileDto {
    constructor(body: TDownloadFileDto) {
        this.fileId = body.fileId;
        this.isEf = (body.isEf ? body.isEf === ("true" as never) : null) as boolean;
    }

    static create(body: unknown) {
        return new DownloadFileDto(body as TDownloadFileDto);
    }
}
