import type {IAdminEntity} from "@entities/Admin/AdminEntity";

type TUpdateAdminPasswordDto = Pick<IAdminEntity, "adminId"> & Partial<Pick<IAdminEntity, "password">>;

export interface UpdateAdminPasswordDto extends TUpdateAdminPasswordDto {}

export class UpdateAdminPasswordDto {
    constructor(body: TUpdateAdminPasswordDto) {
        this.adminId = body.adminId;
        this.password = body.password as string;
    }

    static create(body: TUpdateAdminPasswordDto) {
        return new UpdateAdminPasswordDto(body);
    }
}
