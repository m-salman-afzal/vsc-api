import type {IPerpetualInventoryEntity} from "@entities/PerpetualInventory/PerpetualInventoryEntity";

type TAddStaffSignatureDto = Pick<IPerpetualInventoryEntity, "staffName" | "staffSignature" | "perpetualInventoryId">;

export interface AddStaffSignatureDto extends TAddStaffSignatureDto {}

export class AddStaffSignatureDto {
    private constructor(body: TAddStaffSignatureDto) {
        this.staffSignature = body.staffSignature;
        this.staffName = body.staffName;
        this.perpetualInventoryId = body.perpetualInventoryId;
    }

    static create(body: unknown) {
        return new AddStaffSignatureDto(body as TAddStaffSignatureDto);
    }
}
