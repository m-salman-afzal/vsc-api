import type {IAdminEntity} from "@entities/Admin/AdminEntity";

type TUpsertAdminDto = Pick<IAdminEntity, "firstName" | "lastName" | "email" | "id" | "adminType"> & {
    facilityId: string | string[];
    externalFacilityId: string | string[];
    facility: string | string[];
    roleId: string[];
    role: string[];
    action: "add" | "edit" | "delete";
    failedReason: string;
};

export interface UpsertAdminDto extends TUpsertAdminDto {}

export class UpsertAdminDto {
    constructor(body: TUpsertAdminDto) {
        this.id = body.id as number;
        this.adminType = body.adminType;
        this.firstName = body.firstName;
        this.lastName = body.lastName;
        this.email = body.email;
        this.facilityId = body.facilityId;
        this.externalFacilityId = body.externalFacilityId;
        this.facility = body.facility;
        this.roleId = body.roleId;
        this.action = body.action;
    }

    static create(body: TUpsertAdminDto) {
        return new UpsertAdminDto(body);
    }
}
