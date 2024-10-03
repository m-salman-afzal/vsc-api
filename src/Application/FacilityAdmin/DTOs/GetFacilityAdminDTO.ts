import type {IFacilityAdminEntity} from "@entities/FacilityAdmin/FacilityAdminEntity";

type TGetFacilityAdminDTO = Partial<Pick<IFacilityAdminEntity, "facilityAdminId" | "adminId" | "facilityId">>;

export interface GetFacilityAdminDTO extends TGetFacilityAdminDTO {}

export class GetFacilityAdminDTO {
    private constructor(body: TGetFacilityAdminDTO) {
        this.facilityAdminId = body.facilityAdminId as string;
        this.adminId = body.adminId as string;
        this.facilityId = body.facilityId as string;
    }

    static create(body: TGetFacilityAdminDTO): GetFacilityAdminDTO {
        return new GetFacilityAdminDTO(body);
    }
}
