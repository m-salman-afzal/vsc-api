import type {IFacilityAdminEntity} from "@entities/FacilityAdmin/FacilityAdminEntity";

type TAddFacilityAdminDTO = Pick<IFacilityAdminEntity, "adminId" | "facilityId">;

export interface AddFacilityAdminDTO extends TAddFacilityAdminDTO {}

export class AddFacilityAdminDTO {
    constructor(body: TAddFacilityAdminDTO) {
        this.adminId = body.adminId;
        this.facilityId = body.facilityId;
    }

    static create(body: TAddFacilityAdminDTO): AddFacilityAdminDTO {
        return new AddFacilityAdminDTO(body);
    }
}
