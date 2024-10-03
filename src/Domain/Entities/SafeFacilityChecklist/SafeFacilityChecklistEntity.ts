export interface ISafeFacilityChecklistEntity {
    safeFacilityChecklistId: string;
    facilityChecklistId: string;
    safeReportId: string;
}

export interface SafeFacilityChecklistEntity extends ISafeFacilityChecklistEntity {}

export class SafeFacilityChecklistEntity {
    constructor(body: ISafeFacilityChecklistEntity) {
        this.safeFacilityChecklistId = body.safeFacilityChecklistId;
        this.facilityChecklistId = body.facilityChecklistId;
        this.safeReportId = body.safeReportId;
    }

    static create(body: unknown) {
        return new SafeFacilityChecklistEntity(body as ISafeFacilityChecklistEntity);
    }
}
