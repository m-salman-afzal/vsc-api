import type IBaseRepository from "@entities/IBaseRepository";
import type {SafeReportEntity} from "@entities/SafeReport/SafeReportEntity";
import type {SafeReport} from "@infrastructure/Database/Models/SafeReport";

export interface ISafeReportRepository extends IBaseRepository<SafeReport, SafeReportEntity> {}
