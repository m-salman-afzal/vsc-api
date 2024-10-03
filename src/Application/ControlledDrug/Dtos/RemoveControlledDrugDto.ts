import type {IControlledDrugEntity} from "@entities/ControlledDrug/ControlledDrugEntity";
import type {IFacilityEntity} from "@entities/Facility/FacilityEntity";

type TRemoveControlledDrugDto = Pick<IControlledDrugEntity, "controlledDrugId"> & Pick<IFacilityEntity, "facilityId">;

export interface RemoveControlledDrugDto extends TRemoveControlledDrugDto {}

export class RemoveControlledDrugDto {
    private constructor(body: TRemoveControlledDrugDto) {
        this.controlledDrugId = body.controlledDrugId;
        this.facilityId = body.facilityId;
    }

    static create(body: unknown) {
        return new RemoveControlledDrugDto(body as TRemoveControlledDrugDto);
    }
}
