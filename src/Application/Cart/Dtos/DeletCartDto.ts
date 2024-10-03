type TDeleteCartDto = {
    cartId: string;
};

export interface DeleteCartDto extends TDeleteCartDto {}

export class DeleteCartDto {
    constructor(body: TDeleteCartDto) {
        this.cartId = body.cartId;
    }

    static create(body: unknown) {
        return new DeleteCartDto(body as TDeleteCartDto);
    }
}
