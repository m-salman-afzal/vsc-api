import type {IAuditLogEntity} from "@entities/AuditLog/AuditLogEntity";
import type {TOrder} from "@entities/AuditLog/IAuditLogRepository";

type TGetAuditLogDto = Partial<
    Pick<IAuditLogEntity, "action" | "entity" | "entityId" | "adminId"> & {
        text: string;
        toDate: string;
        fromDate: string;
        currentPage: number;
        perPage: number;
        sort: TOrder;
    }
>;

export interface GetAuditLogDto extends TGetAuditLogDto {}
export class GetAuditLogDto {
    constructor(body: TGetAuditLogDto) {
        this.action = body.action as string;
        this.entity = body.entity as string;
        this.entityId = body.entityId as string;
        this.text = body.text as string;
        this.toDate = body.toDate as string;
        this.fromDate = body.fromDate as string;
        this.sort = body.sort as TOrder;
        this.adminId = body.adminId as string;
    }

    static create(body: unknown) {
        return new GetAuditLogDto(body as TGetAuditLogDto);
    }
}
