import type {IControlledDrugEntity} from "@entities/ControlledDrug/ControlledDrugEntity";
import type {IFormularyLevelEntity} from "@entities/FormularyLevel/FormularyLevelEntity";
import type {IInventoryEntity} from "@entities/Inventory/InventoryEntity";
import type {IInventoryControlEntity} from "@entities/InventoryControl/InventoryControlEntity";

type TAddInventoryDto = Pick<
    IInventoryEntity,
    "ndc" | "manufacturer" | "lotNo" | "expirationDate" | "quantity" | "formularyId" | "facilityId"
> &
    Pick<IInventoryControlEntity, "receiverName" | "witnessName"> & {
        signature: {receiverSignature: string; witnessSignature: string};
    } & Partial<Omit<IFormularyLevelEntity, "formularyLevelId">> &
    Partial<Omit<IControlledDrugEntity, "controlledDrugId">> &
    Partial<{controlledDrugAutoId: number; action: string}>;

export interface AddInventoryDto extends TAddInventoryDto {}

export class AddInventoryDto {
    constructor(body: TAddInventoryDto) {
        this.ndc = body.ndc;
        this.manufacturer = body.manufacturer;
        this.lotNo = body.lotNo;
        this.expirationDate = body.expirationDate;
        this.quantity = body.quantity;
        this.formularyId = body.formularyId;
        this.facilityId = body.facilityId;
        this.receiverName = body.receiverName;
        this.witnessName = body.witnessName;
        this.signature = body.signature;
        this.min = body.min as number;
        this.max = body.max as number;
        this.threshold = body.threshold as number;
        this.parLevel = body.parLevel as number;
        this.controlledId = body.controlledId as string;
        this.controlledType = body.controlledType as string;
        this.cartId = body.cartId as string;
        this.patientName = body.patientName as string;
        this.tr = body.tr as string;
        this.rx = body.rx as string;
        this.providerName = body.providerName as string;
        this.controlledDrugAutoId = body.controlledDrugAutoId as number;
        this.isStock = body?.isStock as boolean;
        this.action = body?.action as string;
    }

    static create(body: unknown) {
        return new AddInventoryDto(body as TAddInventoryDto);
    }
}
