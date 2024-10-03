import type {IPerpetualInventoryEntity} from "@entities/PerpetualInventory/PerpetualInventoryEntity";

export type IShiftCountEntity = Pick<
    IPerpetualInventoryEntity,
    | "perpetualInventoryId"
    | "cartId"
    | "facilityId"
    | "controlledId"
    | "name"
    | "tr"
    | "rx"
    | "rowNumber"
    | "controlledDrugId"
    | "quantityAllocated"
>;
export interface ShiftCountEntity extends IShiftCountEntity {}

export class ShiftCountEntity {
    private constructor(scEntity: IShiftCountEntity) {
        this.perpetualInventoryId = scEntity.perpetualInventoryId;
        this.rx = scEntity.rx;
        this.tr = scEntity.tr;
        this.rowNumber = scEntity.rowNumber;
        this.controlledId = scEntity.controlledId;
        this.name = scEntity.name;
        this.facilityId = scEntity.facilityId;
        this.controlledDrugId = scEntity.controlledDrugId;
        this.cartId = scEntity.cartId;
        this.quantityAllocated = scEntity.quantityAllocated;
    }

    static create(body: unknown) {
        return new ShiftCountEntity(body as IPerpetualInventoryEntity);
    }

    static publicFields(body: unknown) {
        const entity = ShiftCountEntity.create(body);

        return entity;
    }
}
