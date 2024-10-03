type TInitialAllocationDto = {
    formularyAutoId: number;
    drug: string;
    controlledId: string;
    tr: string;
    packageQuantity: number;
    totalUnits: number;
    cart: string[];
    failedReason: string;
    id: number;
};

export interface InitialAllocationDto extends TInitialAllocationDto {}

export class InitialAllocationDto {
    private constructor(body: TInitialAllocationDto) {
        this.drug = body.drug;
        this.controlledId = body.controlledId;
        this.packageQuantity = body.packageQuantity;
        this.totalUnits = body.totalUnits;
        this.cart = body.cart;
        this.tr = body.tr;
        this.id = body.formularyAutoId;
    }

    static create(body: unknown) {
        return new InitialAllocationDto(body as TInitialAllocationDto);
    }
}
