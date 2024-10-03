import type {IAuditLogEntity} from "@entities/AuditLog/AuditLogEntity";

type TAddAuditLogDto = Omit<IAuditLogEntity, "auditLogId">;

export interface AddAuditLogDto extends TAddAuditLogDto {}

export class AddAuditLogDto {
    constructor(body: TAddAuditLogDto) {
        this.action = body.action;
        this.entity = body.entity;
        this.entityId = body.entityId;
        this.data = body.data;
        this.facilityId = body.facilityId;
        this.adminId = body.adminId;
    }

    static create(body: unknown) {
        return new AddAuditLogDto(body as TAddAuditLogDto);
    }
}
