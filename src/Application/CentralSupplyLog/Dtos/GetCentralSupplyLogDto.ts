type TGetCentralSupplyLogDto = {
    fromDate: string;
    toDate: string;
    text: string;
    orderedQuantityMin: number;
    orderedQuantityMax: number;
    firstName: string;
    lastName: string;
    facilityId: string;
};

export interface GetCentralSupplyLogDto extends TGetCentralSupplyLogDto {}

export class GetCentralSupplyLogDto {
    private constructor(body: TGetCentralSupplyLogDto) {
        if (body.text) {
            const names = body.text.split(" ");
            this.firstName = names.at(0) as string;
            if (names.length === 2) {
                this.lastName = names.at(1) as string;
            }
        }
        this.fromDate = body.fromDate;
        this.toDate = body.toDate;
        this.orderedQuantityMin = (body.orderedQuantityMin ? Number(body.orderedQuantityMin) : null) as number;
        this.orderedQuantityMax = (body.orderedQuantityMax ? Number(body.orderedQuantityMax) : null) as number;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new GetCentralSupplyLogDto(body as TGetCentralSupplyLogDto);
    }
}
