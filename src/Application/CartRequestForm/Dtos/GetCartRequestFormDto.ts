type TGetCartRequestFormDto = {
    type: string;
    isControlled: boolean;
    name?: string;
    facilityId?: string;
    cartId: string;
    inventoryFacilityId?: string;
    controlledType?: string;
};

export interface GetCartRequestFormDto extends TGetCartRequestFormDto {}

export class GetCartRequestFormDto {
    private constructor(body: TGetCartRequestFormDto) {
        this.type = body.type;
        this.isControlled = (body.isControlled ? body.isControlled === ("true" as never) : null) as boolean;
        this.name = body.name as string;
        this.facilityId = body.facilityId as string;
        this.inventoryFacilityId = body.facilityId as string;
        this.cartId = body.cartId;
        this.controlledType = body.controlledType as string;
    }

    static create(body: unknown) {
        return new GetCartRequestFormDto(body as TGetCartRequestFormDto);
    }
}
