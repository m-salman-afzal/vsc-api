type TGetBridgeTherapyAdminDto = {text?: string; facilityId: string};

export interface GetBridgeTherapyAdminDto extends TGetBridgeTherapyAdminDto {}

export class GetBridgeTherapyAdminDto {
    private constructor(body: TGetBridgeTherapyAdminDto) {
        this.text = body.text as string;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new GetBridgeTherapyAdminDto(body as TGetBridgeTherapyAdminDto);
    }
}
