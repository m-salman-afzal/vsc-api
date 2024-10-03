type TGetCartPickDto = {
    pickStatus: string;
    allocationStatus?: string;
    name?: string;
    facilityId: string;
    type?: string;
};

export interface GetCartPickDto extends TGetCartPickDto {}

export class GetCartPickDto {
    private constructor(body: TGetCartPickDto) {
        this.pickStatus = body.pickStatus;
        this.allocationStatus = body.allocationStatus === "null" ? (null as never) : (body.allocationStatus as string);
        this.name = body.name as string;
        this.facilityId = body.facilityId;
        this.type = body.type as string;
    }

    static create(body: unknown) {
        return new GetCartPickDto(body as TGetCartPickDto);
    }
}
