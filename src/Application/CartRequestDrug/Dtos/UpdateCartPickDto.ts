type TUpdateCartPickDto = {
    formularyId: string[];
    pickStatus: string;
    allocationStatus: string;
    facilityId: string;
    undo?: boolean;
};

export interface UpdateCartPickDto extends TUpdateCartPickDto {}

export class UpdateCartPickDto {
    private constructor(body: TUpdateCartPickDto) {
        this.formularyId = body.formularyId;
        this.pickStatus = body.pickStatus;
        this.allocationStatus = body.allocationStatus === "null" ? (null as never) : (body.allocationStatus as string);
        this.facilityId = body.facilityId;
        this.undo = body.undo as boolean;
    }

    static create(body: unknown) {
        return new UpdateCartPickDto(body as TUpdateCartPickDto);
    }
}
