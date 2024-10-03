import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {SafeReport} from "@infrastructure/Database/Models/SafeReport";

import type {ISafeReportRepository} from "@entities/SafeReport/ISafeReportRepository";
import type {SafeReportEntity} from "@entities/SafeReport/SafeReportEntity";

@injectable()
export class SafeReportRepository
    extends BaseRepository<SafeReport, SafeReportEntity>
    implements ISafeReportRepository
{
    constructor() {
        super(SafeReport);
    }
}
