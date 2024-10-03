import type {IFormularyEntity} from "@entities/Formulary/FormularyEntity";

type TGetInventoryDto = Partial<
    Pick<
        IFormularyEntity,
        "isActive" | "formularyId" | "genericName" | "brandName" | "id" | "isControlled" | "isFormulary"
    > & {
        name: string;
        isPendingOrder: boolean;
        isDepleted: boolean;
        facilityId: string;
        isActiveInventory: boolean;
        isStock?: boolean;
        isActiveInventoryForNdcStatus: string;
    }
>;

export interface GetInventoryDto extends TGetInventoryDto {}

export class GetInventoryDto {
    constructor(body: TGetInventoryDto) {
        const name = body.name?.trim() as string;

        this.formularyId = body.formularyId as string;
        this.isActiveInventory = (body.isActive ? body.isActive === ("true" as never) : null) as boolean;
        this.isActiveInventoryForNdcStatus = body.isActive as unknown as string;
        this.name = name;
        this.id = name as unknown as number;
        this.isPendingOrder = (body.isPendingOrder ? body.isPendingOrder === ("true" as never) : null) as boolean;
        this.isControlled = (body.isControlled ? body.isControlled === ("true" as never) : null) as boolean;
        this.isFormulary = (body.isFormulary ? body.isFormulary === ("true" as never) : null) as boolean;
        this.isDepleted = (body.isDepleted ? body.isDepleted === ("true" as never) : null) as boolean;
        this.isStock = (body.isStock ? body.isStock === ("true" as never) : null) as boolean;
        this.facilityId = body.facilityId as string;
    }

    static create(body: unknown) {
        return new GetInventoryDto(body as TGetInventoryDto);
    }
}
