export interface ISafeReportEntity {
    safeReportId: string;
    eventType: string;
    patientName: string;
    date: string;
    time: string;
    severityType: string;
    nearMissType: string;
    isPatientHarmed: boolean;
    sbarrSituation: string;
    sbarrBackground: string;
    sbarrAction: string;
    sbarrRecommendation: string;
    sbarrResult: string;
    interventionDescription: string;
    involvedParty: string;
    isFinding: boolean;
    findings: string;
    involvedPartyText: string;
    detail: string;
}

export interface SafeReportEntity extends ISafeReportEntity {}

export class SafeReportEntity {
    constructor(body: ISafeReportEntity) {
        this.safeReportId = body.safeReportId;
        this.eventType = body.eventType;
        this.patientName = body.patientName ? body.patientName.trim() : body.patientName;
        this.date = body.date;
        this.time = body.time;
        this.severityType = body.severityType;
        this.nearMissType = body.nearMissType;
        this.isPatientHarmed = body.isPatientHarmed;
        this.sbarrSituation = body.sbarrSituation ? body.sbarrSituation.trim() : body.sbarrSituation;
        this.sbarrBackground = body.sbarrBackground ? body.sbarrBackground.trim() : body.sbarrBackground;
        this.sbarrAction = body.sbarrAction ? body.sbarrAction.trim() : body.sbarrAction;
        this.sbarrRecommendation = body.sbarrRecommendation
            ? body.sbarrRecommendation.trim()
            : body.sbarrRecommendation;
        this.sbarrResult = body.sbarrResult ? body.sbarrResult.trim() : body.sbarrResult;
        this.interventionDescription = body.interventionDescription
            ? body.interventionDescription.trim()
            : body.interventionDescription;
        this.involvedParty = body.involvedParty ? body.involvedParty.trim() : body.involvedParty;
        this.isFinding = body.isFinding;
        this.findings = body.findings ? body.findings.trim() : body.findings;
        this.involvedPartyText = body.involvedPartyText ? body.involvedPartyText.trim() : body.involvedPartyText;
        this.detail = body.detail ? body.detail.trim() : body.detail;
    }

    static create(body: unknown) {
        return new SafeReportEntity(body as ISafeReportEntity);
    }
}
