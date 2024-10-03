import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {File} from "@infrastructure/Database/Models/File";

import {SEARCH_FILE_REPOSITORY_FIELDS} from "./Shared/Query/FieldsBuilder";
import {FileQueryBuilder} from "./Shared/Query/FileQueryBuilder";

import type {TFilterFile} from "./Shared/Query/FileQueryBuilder";
import type {FileEntity} from "@entities/File/FileEntity";
import type {IFileRepository} from "@entities/File/IFileRepository";
import type PaginationOptions from "@infraUtils/PaginationOptions";

@injectable()
export class FileRepository extends BaseRepository<File, FileEntity> implements IFileRepository {
    constructor() {
        super(File);
    }

    async fetchBySearchQuery(searchFilters: TFilterFile) {
        const query = this.model
            .createQueryBuilder("file")
            .leftJoin("file.facility", "facility")
            .leftJoin("file.admin", "admin")
            .orderBy("file.id", "ASC");

        const queryFilters = FileQueryBuilder.setFilter(query, searchFilters);

        const rows = await queryFilters.select(SEARCH_FILE_REPOSITORY_FIELDS).getRawMany();

        if (rows.length === 0) {
            return false;
        }

        return rows;
    }

    async fetchPaginatedBySearchQuery(searchFilters: TFilterFile, pagination: PaginationOptions) {
        const query = this.model
            .createQueryBuilder("file")
            .leftJoinAndSelect("file.admin", "admin")
            .leftJoinAndSelect("file.facility", "facility")
            .leftJoinAndSelect("file.referenceGuide", "referenceGuide")
            .orderBy("file.id", "DESC")
            .limit(pagination.perPage)
            .offset(pagination.offset);

        const countQuery = this.model.createQueryBuilder("file").leftJoinAndSelect("file.admin", "admin");

        const queryFilters = FileQueryBuilder.setFilter(query, searchFilters);
        const countFilters = FileQueryBuilder.setFilter(countQuery, searchFilters);

        const count = await countFilters.getCount();
        const rows = await queryFilters.getMany();

        if (rows.length === 0) {
            return false;
        }

        return {count: count, rows: rows};
    }
}
