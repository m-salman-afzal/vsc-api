import type {IControlledDrugEntity} from "@entities/ControlledDrug/ControlledDrugEntity";

type TUpdateControlledDrugDto = Pick<IControlledDrugEntity, "controlledDrugId"> & Partial<IControlledDrugEntity>;

export interface UpdateControlledDrugDto extends TUpdateControlledDrugDto {}

export class UpdateControlledDrugDto {
    private constructor(body: TUpdateControlledDrugDto) {
        this.controlledDrugId = body.controlledDrugId;
        this.controlledId = body.controlledId as string;
        this.tr = body.tr as string;
        this.controlledQuantity = body.controlledQuantity as number;
    }

    static create(body: unknown) {
        return new UpdateControlledDrugDto(body as TUpdateControlledDrugDto);
    }
}
