type TDownloadInventoryHistoryDto = {
    inventoryHistoryId: string;
    isControlled?: boolean | string;
};

export interface DownloadInventoryHistoryDto extends TDownloadInventoryHistoryDto {}

export class DownloadInventoryHistoryDto {
    private constructor(body: TDownloadInventoryHistoryDto) {
        this.inventoryHistoryId = body.inventoryHistoryId;
        this.isControlled = body.isControlled ? (body.isControlled === ("true" as never) ? "1" : "0") : (null as never);
    }

    static create(body: unknown) {
        return new DownloadInventoryHistoryDto(body as TDownloadInventoryHistoryDto);
    }
}
