import type {IFacilityAdminEntity} from "@entities/FacilityAdmin/FacilityAdminEntity";

type TRemoveFacilityAdminDTO = Partial<Pick<IFacilityAdminEntity, "adminId" | "facilityId" | "facilityAdminId">>;

export interface RemoveFacilityAdminDTO extends TRemoveFacilityAdminDTO {}

export class RemoveFacilityAdminDTO {
    constructor(body: TRemoveFacilityAdminDTO) {
        this.adminId = body.adminId as string;
        this.facilityId = body.facilityId as string;
        this.facilityAdminId = body.facilityAdminId as string;
    }

    static create(body: TRemoveFacilityAdminDTO) {
        return new RemoveFacilityAdminDTO(body);
    }
}
