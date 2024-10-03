import type IBaseRepository from "@entities/IBaseRepository";
import type {ReportEntity} from "@entities/Report/ReportEntity";
import type {Report} from "@infrastructure/Database/Models/Report";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TFilterReport} from "@repositories/Shared/Query/ReportQueryBuilder";

export interface IReportRepository extends IBaseRepository<Report, ReportEntity> {
    fetchPaginatedWithAdmins(
        searchFilters: TFilterReport,
        pagination: PaginationOptions
    ): Promise<false | {count: number; rows: Report[]}>;

    fetchWithAdmins(searchFilters: TFilterReport): Promise<Report | false>;

    fetchWithAssignees(searchFilters: TFilterReport): Promise<Report[] | false>;
}
