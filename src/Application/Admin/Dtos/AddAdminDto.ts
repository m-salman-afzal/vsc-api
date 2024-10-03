import type {IAdminEntity} from "@entities/Admin/AdminEntity";

type TAddAdminDto = Pick<IAdminEntity, "firstName" | "lastName" | "email" | "adminType"> & {
    facilityId: string | string[];
    externalFacilityId: string | string[];
    roleId: string | string[];
    role: string[];
};

export interface AddAdminDto extends TAddAdminDto {}

export class AddAdminDto {
    constructor(body: TAddAdminDto) {
        this.firstName = body.firstName;
        this.lastName = body.lastName;
        this.email = body.email;
        this.adminType = body.adminType;
        this.facilityId = body.facilityId;
        this.externalFacilityId = body.externalFacilityId;
        this.roleId = body.roleId;
    }

    static create(body: TAddAdminDto) {
        return new AddAdminDto(body);
    }
}
