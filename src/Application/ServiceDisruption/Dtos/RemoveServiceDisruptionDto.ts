type TRemoveServiceDisruptionDto = {
    serviceDisruptionId: string;
    facilityId: string;
};

export interface RemoveServiceDisruptionDto extends TRemoveServiceDisruptionDto {}

export class RemoveServiceDisruptionDto {
    constructor(body: TRemoveServiceDisruptionDto) {
        this.serviceDisruptionId = body.serviceDisruptionId;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new RemoveServiceDisruptionDto(body as TRemoveServiceDisruptionDto);
    }
}
