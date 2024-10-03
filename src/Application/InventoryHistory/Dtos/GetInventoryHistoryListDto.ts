type TGetInventoryHistoryListDto = {
    fromDate: string;
    toDate: string;
    facilityId: string;
};
export interface GetInventoryHistoryListDto extends TGetInventoryHistoryListDto {}

export class GetInventoryHistoryListDto {
    private constructor(body: TGetInventoryHistoryListDto) {
        this.fromDate = body.fromDate;
        this.toDate = body.toDate;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new GetInventoryHistoryListDto(body as TGetInventoryHistoryListDto);
    }
}
