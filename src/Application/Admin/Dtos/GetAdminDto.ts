import type {IAdminEntity} from "@entities/Admin/AdminEntity";
import type {IFacilityAdminEntity} from "@entities/FacilityAdmin/FacilityAdminEntity";

type TGetAdminDto = Partial<
    Pick<IAdminEntity, "firstName" | "lastName" | "email" | "adminType"> & Pick<IFacilityAdminEntity, "facilityId">
>;

export interface GetAdminDto extends TGetAdminDto {}

export class GetAdminDto {
    private constructor(body: TGetAdminDto) {
        this.firstName = body.firstName as string;
        this.lastName = body.lastName as string;
        this.email = body.email as string;
        this.adminType = body.adminType as string;
        this.facilityId = body.facilityId as string;
    }

    static create(body: TGetAdminDto) {
        return new GetAdminDto(body);
    }
}
