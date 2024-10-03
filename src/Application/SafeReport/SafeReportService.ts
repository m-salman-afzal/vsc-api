import {inject, injectable} from "tsyringe";

import {SafeReportEntity} from "@entities/SafeReport/SafeReportEntity";

import {SAFE_SEVERITY_TYPES} from "@constants/ReportConstant";

import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import type {AddSafeReportDto} from "./Dtos/AddSafeReportDto";
import type {UpdateSafeReportDto} from "./Dtos/UpdateSafeReportDto";
import type {ISafeReportRepository} from "@entities/SafeReport/ISafeReportRepository";
import type {SafeReport} from "@infrastructure/Database/Models/SafeReport";

@injectable()
export class SafeReportService extends BaseService<SafeReport, SafeReportEntity> {
    constructor(@inject("ISafeReportRepository") safeReportRepository: ISafeReportRepository) {
        super(safeReportRepository);
    }

    async subAddSafeReport(addSafeReportDto: AddSafeReportDto) {
        const safeReportEntity = SafeReportEntity.create(addSafeReportDto);
        safeReportEntity.safeReportId = SharedUtils.shortUuid();

        await this.create(safeReportEntity);

        return safeReportEntity;
    }

    async subUpdateSafeReport(updateSafeReportDto: UpdateSafeReportDto) {
        const isSafeReport = await this.fetch({safeReportId: updateSafeReportDto.safeReportId});
        if (!isSafeReport) {
            return false;
        }

        const safeReportEntity = SafeReportEntity.create({...isSafeReport, ...updateSafeReportDto});

        if (safeReportEntity.severityType != null || safeReportEntity.detail) {
            switch (safeReportEntity.severityType) {
                case SAFE_SEVERITY_TYPES.NEAR_MISS:
                    safeReportEntity.isPatientHarmed = null as never;
                    safeReportEntity.detail = null as never;
                    break;

                case SAFE_SEVERITY_TYPES.REACHED_PATIENT:
                    safeReportEntity.nearMissType = null as never;
                    safeReportEntity.detail = null as never;
                    break;

                default:
                    safeReportEntity.sbarrSituation = null as never;
                    safeReportEntity.sbarrAction = null as never;
                    safeReportEntity.sbarrBackground = null as never;
                    safeReportEntity.sbarrRecommendation = null as never;
                    safeReportEntity.sbarrResult = null as never;
                    safeReportEntity.nearMissType = null as never;
                    safeReportEntity.isPatientHarmed = null as never;
                    safeReportEntity.severityType = null as never;
                    break;
            }
        }

        await this.update({safeReportId: updateSafeReportDto.safeReportId}, safeReportEntity);

        return safeReportEntity;
    }
}
