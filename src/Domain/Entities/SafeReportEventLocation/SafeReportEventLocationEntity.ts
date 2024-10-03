export interface ISafeReportEventLocationEntity {
    safeReportEventLocationId: string;
    safeReportId: string;
    safeEventLocationId: string;
    description: string;
}

export interface SafeReportEventLocationEntity extends ISafeReportEventLocationEntity {}

export class SafeReportEventLocationEntity {
    constructor(body: ISafeReportEventLocationEntity) {
        this.safeReportEventLocationId = body.safeReportEventLocationId;
        this.safeReportId = body.safeReportId;
        this.safeEventLocationId = body.safeEventLocationId;
        this.description = body.description ? body.description.trim() : body.description;
    }

    static create(body: unknown) {
        return new SafeReportEventLocationEntity(body as ISafeReportEventLocationEntity);
    }
}
