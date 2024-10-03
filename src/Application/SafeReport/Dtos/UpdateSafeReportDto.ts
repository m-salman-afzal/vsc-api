import type {ISafeReportEntity} from "@entities/SafeReport/SafeReportEntity";

type IUpdateSafeReportDto = Pick<ISafeReportEntity, "safeReportId"> & Partial<ISafeReportEntity>;

export interface UpdateSafeReportDto extends IUpdateSafeReportDto {}

export class UpdateSafeReportDto {
    private constructor(body: IUpdateSafeReportDto) {
        this.safeReportId = body.safeReportId;
        this.patientName = body.patientName as string;
        this.date = body.date as string;
        this.time = body.time as string;
        this.severityType = body.severityType as string;
        this.nearMissType = body.nearMissType as string;
        this.isPatientHarmed = body.isPatientHarmed as boolean;
        this.sbarrSituation = body.sbarrSituation as string;
        this.sbarrBackground = body.sbarrBackground as string;
        this.sbarrAction = body.sbarrAction as string;
        this.sbarrRecommendation = body.sbarrRecommendation as string;
        this.sbarrResult = body.sbarrResult as string;
        this.interventionDescription = body.interventionDescription as string;
        this.involvedParty = body.involvedParty as string;
        this.eventType = body.eventType as string;
        this.isFinding = body.isFinding as boolean;
        this.involvedPartyText = body.involvedPartyText as string;
        this.findings = body.findings as string;
        this.detail = body.detail as string;
    }

    static create(body: unknown) {
        return new UpdateSafeReportDto(body as IUpdateSafeReportDto);
    }
}
