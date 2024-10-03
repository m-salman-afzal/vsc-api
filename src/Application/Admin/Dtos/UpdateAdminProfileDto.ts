import type {IAdminEntity} from "@entities/Admin/AdminEntity";

type TUpdateAdminProfileDto = Pick<IAdminEntity, "adminId"> & Partial<Pick<IAdminEntity, "firstName" | "lastName">>;

export interface UpdateAdminProfileDto extends TUpdateAdminProfileDto {}

export class UpdateAdminProfileDto {
    constructor(body: TUpdateAdminProfileDto) {
        this.adminId = body.adminId;
        this.firstName = body.firstName as string;
        this.lastName = body.lastName as string;
    }

    static create(body: TUpdateAdminProfileDto) {
        return new UpdateAdminProfileDto(body);
    }
}
