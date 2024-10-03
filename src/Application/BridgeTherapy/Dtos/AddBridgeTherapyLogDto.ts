import type {IBridgeTherapyLogEntity} from "@entities/BridgeTherapyLog/BridgeTherapyLogEntity";

type TAddBridgeTherapyLogDto = Pick<IBridgeTherapyLogEntity, "facilityId" | "adminId" | "filename">;

export interface AddBridgeTherapyLogDto extends TAddBridgeTherapyLogDto {}

export class AddBridgeTherapyLogDto {
    constructor(body: TAddBridgeTherapyLogDto) {
        this.facilityId = body.facilityId;
        this.adminId = body.adminId;
        this.filename = body.filename;
    }

    static create(body: unknown) {
        return new AddBridgeTherapyLogDto(body as TAddBridgeTherapyLogDto);
    }
}
