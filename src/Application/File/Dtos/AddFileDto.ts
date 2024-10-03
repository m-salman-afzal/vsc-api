import type {IFileEntity} from "@entities/File/FileEntity";

type TAddFileDto = Pick<
    IFileEntity,
    "fileName" | "fileExtension" | "repository" | "process" | "adminId" | "facilityId" | "referenceGuideId"
> & {
    fileContent: string;
};

export interface AddFileDto extends TAddFileDto {}

export class AddFileDto {
    constructor(body: TAddFileDto) {
        this.fileName = body.fileName;
        this.fileExtension = body.fileExtension;
        this.repository = body.repository;
        this.process = body.process;
        this.fileContent = body.fileContent;
        this.adminId = body.adminId;
        this.facilityId = body.facilityId;
        this.referenceGuideId = body.referenceGuideId;
    }

    static create(body: TAddFileDto) {
        return new AddFileDto(body);
    }
}
