import {Brackets} from "typeorm";

import {FACILITY_FREE_REPOSITORIES} from "@constants/FileConstant";

import SharedUtils from "@appUtils/SharedUtils";

import type {IFileEntity} from "@entities/File/FileEntity";
import type {File} from "@infrastructure/Database/Models/File";
import type {TQueryBuilder} from "@typings/ORM";

export type TFilterFile = Partial<
    IFileEntity & {
        fromDate: string;
        toDate: string;
        firstName: string;
        lastName: string;
    }
>;

type TQueryBuilderFile = TQueryBuilder<File>;

export class FileQueryBuilder {
    private query: TQueryBuilderFile;
    constructor(query: TQueryBuilderFile, filters: TFilterFile) {
        this.query = query;

        this.setFileId(filters);
        this.setFileName(filters);
        this.setFileExtension(filters);
        this.setStatus(filters);
        this.setProcess(filters);
        this.setRepository(filters);
        this.setIsEf(filters);
        this.setAdminId(filters);
        this.setFacilityId(filters);
        this.setDateRange(filters);
        this.setFirstName(filters);
        this.setLastName(filters);
    }

    static setFilter(query: TQueryBuilderFile, filters: TFilterFile) {
        return new FileQueryBuilder(query, filters).query;
    }

    setAdminId(filters: TFilterFile) {
        if (filters.adminId) {
            this.query.andWhere("admin.adminId = :adminId", {adminId: filters.adminId});
        }
    }

    setFileId(filters: TFilterFile) {
        if (filters.fileId) {
            this.query.andWhere("file.fileId = :fileId", {fileId: filters.fileId});
        }
    }

    setFileName(filters: TFilterFile) {
        if (filters.fileName) {
            this.query.andWhere("file.fileName LIKE :fileName", {fileName: `%${filters.fileName}%`});
        }
    }

    setFileExtension(filters: TFilterFile) {
        if (filters.fileExtension) {
            this.query.andWhere("file.fileExtension = :fileExtension", {fileExtension: filters.fileExtension});
        }
    }

    setStatus(filters: TFilterFile) {
        if (filters.status) {
            this.query.andWhere("file.status = :status", {status: filters.status});
        }
    }

    setProcess(filters: TFilterFile) {
        if (filters.process) {
            if (Array.isArray(filters.process)) {
                this.query.andWhere("file.process IN (:...process)", {process: filters.process});

                return;
            }
            this.query.andWhere("file.process = :process", {process: filters.process});
        }
    }

    setRepository(filters: TFilterFile) {
        if (filters.repository) {
            if (Array.isArray(filters.repository)) {
                this.query.andWhere("file.repository IN (:...repository)", {repository: filters.repository});

                return;
            }
            this.query.andWhere("file.repository = :repository", {repository: filters.repository});
        }
    }

    setIsEf(filters: TFilterFile) {
        if ("isEf" in filters && filters.isEf != null) {
            this.query.andWhere("file.isEf = :isEf", {isEf: filters.isEf});
        }
    }

    setFacilityId(filters: TFilterFile) {
        if (
            filters.repository &&
            !(FACILITY_FREE_REPOSITORIES as string[]).includes(filters.repository) &&
            Array.isArray(filters.facilityId)
        ) {
            this.query.andWhere("file.facilityId IN (:...facilityId)", {facilityId: filters.facilityId});

            return;
        }

        if (
            filters.repository &&
            !(FACILITY_FREE_REPOSITORIES as string[]).includes(filters.repository) &&
            filters.facilityId
        ) {
            this.query.andWhere("file.facilityId = :facilityId", {facilityId: filters.facilityId});
        }
    }

    setDateRange(filters: TFilterFile) {
        if (filters.fromDate) {
            this.query.andWhere("file.createdAt >= :fromDate", {
                fromDate: SharedUtils.setDateStartHours(filters.fromDate)
            });
        }

        if (filters.toDate) {
            this.query.andWhere("file.createdAt <= :toDate", {
                toDate: SharedUtils.setDateEndHours(filters.toDate)
            });
        }
    }

    setFirstName(filters: TFilterFile) {
        if (filters.firstName) {
            this.query.andWhere(
                new Brackets((qb) => {
                    qb.orWhere("admin.firstName LIKE :firstName", {firstName: `%${filters.firstName}%`});
                    qb.orWhere("admin.lastName LIKE :firstName", {firstName: `%${filters.firstName}%`});
                })
            );
        }
    }

    setLastName(filters: TFilterFile) {
        if (filters.lastName) {
            this.query.andWhere(
                new Brackets((qb) => {
                    qb.orWhere("admin.lastName LIKE :lastName", {lastName: `%${filters.lastName}%`});
                    qb.orWhere("admin.firstName LIKE :lastName", {lastName: `%${filters.lastName}%`});
                })
            );
        }
    }
}
