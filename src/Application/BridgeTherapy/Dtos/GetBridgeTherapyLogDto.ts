import type {TOrder} from "@entities/AuditLog/IAuditLogRepository";
import type {IBridgeTherapyLogEntity} from "@entities/BridgeTherapyLog/BridgeTherapyLogEntity";

type TGetBridgeTherapyLogDto = Pick<IBridgeTherapyLogEntity, "facilityId"> &
    Partial<Pick<IBridgeTherapyLogEntity, "adminId"> & {bridgeTherapyLogCreatedAt: string}> & {sort: TOrder};

export interface GetBridgeTherapyLogDto extends TGetBridgeTherapyLogDto {}

export class GetBridgeTherapyLogDto {
    constructor(body: TGetBridgeTherapyLogDto) {
        this.facilityId = body.facilityId;
        this.adminId = body.adminId as string;
        this.bridgeTherapyLogCreatedAt = body.bridgeTherapyLogCreatedAt as string;
        this.sort = body.sort as TOrder;
    }

    static create(body: unknown) {
        return new GetBridgeTherapyLogDto(body as TGetBridgeTherapyLogDto);
    }
}
