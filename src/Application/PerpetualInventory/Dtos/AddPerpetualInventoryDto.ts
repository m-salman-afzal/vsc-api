import type {IPerpetualInventoryEntity} from "@entities/PerpetualInventory/PerpetualInventoryEntity";

type TAddPerpetualInventoryDto = Omit<
    IPerpetualInventoryEntity,
    "perpetualInventoryId" | "staffSignature" | "isModified" | "rowNumber"
>;

export interface AddPerpetualInventoryDto extends TAddPerpetualInventoryDto {}

export class AddPerpetualInventoryDto {
    private constructor(body: TAddPerpetualInventoryDto) {
        this.tr = body.tr;
        this.rx = body.rx;
        this.name = body.name;
        this.facilityId = body.facilityId;
        this.controlledId = body.controlledId;
        this.patientName = body.patientName;
        this.providerName = body.providerName;
        this.quantityAllocated = body.quantityAllocated;
        this.cartRequestDeductionId = body.cartRequestDeductionId;
        this.controlledDrugId = body.controlledDrugId;
        this.cartId = body.cartId;
        this.isPatientSpecific = body.isPatientSpecific;
    }

    static create(body: unknown) {
        return new AddPerpetualInventoryDto(body as TAddPerpetualInventoryDto);
    }
}
