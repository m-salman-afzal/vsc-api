import type {FileEntity} from "@entities/File/FileEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {Admin} from "@infrastructure/Database/Models/Admin";
import type {Facility} from "@infrastructure/Database/Models/Facility";
import type {File} from "@infrastructure/Database/Models/File";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TFilterFile} from "@repositories/Shared/Query/FileQueryBuilder";

export interface IFileRepository extends IBaseRepository<File, FileEntity> {
    fetchBySearchQuery(searchFilters: TFilterFile): Promise<false | (File & Admin & Facility)[]>;

    fetchPaginatedBySearchQuery(
        searchFilters: TFilterFile,
        pagination: PaginationOptions
    ): Promise<false | {count: number; rows: File[]}>;
}
