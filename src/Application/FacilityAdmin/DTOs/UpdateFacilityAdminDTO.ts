import type {IFacilityAdminEntity} from "@entities/FacilityAdmin/FacilityAdminEntity";

type TUpdateFacilityAdminDTO = Partial<
    Pick<IFacilityAdminEntity, "facilityAdminId" | "adminId"> & {facilityId: string | string[]}
>;

export interface UpdateFacilityAdminDTO extends TUpdateFacilityAdminDTO {}

export class UpdateFacilityAdminDTO {
    private constructor(body: TUpdateFacilityAdminDTO) {
        this.facilityAdminId = body.facilityAdminId as string;
        this.adminId = body.adminId as string;
        this.facilityId = body.facilityId as string | string[];
    }

    static create(body: TUpdateFacilityAdminDTO): UpdateFacilityAdminDTO {
        return new UpdateFacilityAdminDTO(body);
    }
}
