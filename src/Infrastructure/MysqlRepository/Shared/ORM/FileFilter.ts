import {Like} from "typeorm";

import type {IFileEntity} from "@entities/File/FileEntity";
import type {File} from "@infrastructure/Database/Models/File";
import type {TWhereFilter} from "@typings/ORM";

type TFilterFile = Partial<IFileEntity>;
type TWhereFile = TWhereFilter<File>;

export class FileFilter {
    private where: TWhereFile;

    constructor(filters: TFilterFile) {
        this.where = {};

        this.setFileId(filters);
        this.setFileName(filters);
        this.setFileExtension(filters);
        this.setStatus(filters);
        this.setProcess(filters);
        this.setRepository(filters);
        this.setIsEf(filters);
        this.setAdminId(filters);
        this.setFacilityId(filters);
    }

    static setFilter(filters: TFilterFile) {
        return new FileFilter(filters).where;
    }

    setAdminId(filters: TFilterFile) {
        if (filters.adminId) {
            this.where.adminId = filters.adminId;
        }
    }

    setFileId(filters: TFilterFile) {
        if (filters.fileId) {
            this.where.fileId = filters.fileId;
        }
    }

    setFileName(filters: TFilterFile) {
        if (filters.fileName) {
            this.where.fileName = Like(`%${filters.fileName}%`);
        }
    }
    setFileExtension(filters: TFilterFile) {
        if (filters.fileExtension) {
            this.where.fileExtension = filters.fileExtension;
        }
    }

    setStatus(filters: TFilterFile) {
        if (filters.status) {
            this.where.status = filters.status;
        }
    }

    setRepository(filters: TFilterFile) {
        if (filters.repository) {
            this.where.repository = filters.repository;
        }
    }

    setProcess(filters: TFilterFile) {
        if (filters.process) {
            this.where.process = filters.process;
        }
    }

    setIsEf(filters: TFilterFile) {
        if (filters.isEf) {
            this.where.isEf = filters.isEf;
        }
    }

    setFacilityId(filters: TFilterFile) {
        if (filters.facilityId) {
            this.where.facilityId = filters.facilityId;
        }
    }
}
