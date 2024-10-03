import SharedUtils from "@appUtils/SharedUtils";

import type {TFileInfo} from "@typings/File";

export interface IFileEntity {
    fileId: string;
    fileName: string;
    fileExtension: string;
    repository: string;
    process: string;
    status: string;
    isEf: boolean;
    info: TFileInfo;
    adminId: string;
    facilityId: string;
    createdAt?: string;
    referenceGuideId: string;
}

export interface FileEntity extends IFileEntity {}

export class FileEntity {
    constructor(body: IFileEntity) {
        this.fileId = body.fileId;
        this.fileName = body.fileName ? body.fileName.trim() : body.fileName;
        this.fileExtension = body.fileExtension;
        this.repository = body.repository;
        this.process = body.process;
        this.status = body.status;
        this.isEf = body.isEf;
        this.info = body.info;
        this.adminId = body.adminId;
        this.facilityId = body.facilityId;
        this.referenceGuideId = body.referenceGuideId;
    }

    static create(fileEntity: unknown) {
        return new FileEntity(fileEntity as IFileEntity);
    }

    static publicFields(fileEntity: unknown) {
        const file = new FileEntity(fileEntity as IFileEntity);

        const {date, time} = SharedUtils.setDateTime((fileEntity as IFileEntity).createdAt as string);
        file.createdAt = `${date} ${time}`;

        return file;
    }
}
