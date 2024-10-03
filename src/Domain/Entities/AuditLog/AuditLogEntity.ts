export interface IAuditLogEntity {
    auditLogId: string;
    action: string;
    entity: string;
    entityId: string;
    data: string;
    adminId: string;
    facilityId: string;
}

export interface AuditLogEntity extends IAuditLogEntity {}
export class AuditLogEntity {
    constructor(body: IAuditLogEntity) {
        this.auditLogId = body.auditLogId;
        this.action = body.action;
        this.entity = body.entity;
        this.entityId = body.entityId;
        this.data = body.data;
        this.adminId = body.adminId;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new AuditLogEntity(body as IAuditLogEntity);
    }
}
