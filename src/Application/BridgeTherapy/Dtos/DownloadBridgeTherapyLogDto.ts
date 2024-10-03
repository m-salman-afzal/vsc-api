import {GetBridgeTherapyLogDto} from "./GetBridgeTherapyLogDto";

import type {IBridgeTherapyLogEntity} from "@entities/BridgeTherapyLog/BridgeTherapyLogEntity";

type TDownloadBridgeTherapyLogDto = Pick<IBridgeTherapyLogEntity, "bridgeTherapyLogId"> & GetBridgeTherapyLogDto;

export interface DownloadBridgeTherapyLogDto extends TDownloadBridgeTherapyLogDto {}

export class DownloadBridgeTherapyLogDto extends GetBridgeTherapyLogDto {
    constructor(body: TDownloadBridgeTherapyLogDto) {
        super(body);

        this.bridgeTherapyLogId = body.bridgeTherapyLogId;
    }

    static override create(body: unknown) {
        return new DownloadBridgeTherapyLogDto(body as TDownloadBridgeTherapyLogDto);
    }
}
