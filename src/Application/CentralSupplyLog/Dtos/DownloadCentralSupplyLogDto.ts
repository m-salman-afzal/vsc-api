import {BOOLEAN_VALUES} from "@appUtils/Constants";

type TDownloadCentralSupplyLogDto = {
    facilityId: string;
    isControlled: boolean;
};

export interface DownloadCentralSupplyLogDto extends TDownloadCentralSupplyLogDto {}

export class DownloadCentralSupplyLogDto {
    private constructor(body: TDownloadCentralSupplyLogDto) {
        this.facilityId = body.facilityId;
        this.isControlled = (
            body.isControlled ? (body.isControlled as never) === BOOLEAN_VALUES.TRUE : null
        ) as boolean;
    }

    static create(body: unknown) {
        return new DownloadCentralSupplyLogDto(body as TDownloadCentralSupplyLogDto);
    }
}
