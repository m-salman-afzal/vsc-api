import type {ISafeReportEntity} from "@entities/SafeReport/SafeReportEntity";

type IAddSafeReportDto = Omit<ISafeReportEntity, "safeReportId">;

export interface AddSafeReportDto extends IAddSafeReportDto {}

export class AddSafeReportDto {
    private constructor(body: IAddSafeReportDto) {
        this.patientName = body.patientName;
        this.date = body.date;
        this.time = body.time;
        this.severityType = body.severityType;
        this.nearMissType = body.nearMissType;
        this.isPatientHarmed = body.isPatientHarmed;
        this.sbarrSituation = body.sbarrSituation;
        this.sbarrBackground = body.sbarrBackground;
        this.sbarrAction = body.sbarrAction;
        this.sbarrRecommendation = body.sbarrRecommendation;
        this.sbarrResult = body.sbarrResult;
        this.interventionDescription = body.interventionDescription;
        this.involvedParty = body.involvedParty;
        this.detail = body.detail;
    }

    static create(body: unknown) {
        return new AddSafeReportDto(body as IAddSafeReportDto);
    }
}
