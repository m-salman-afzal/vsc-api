import type {IAdminEntity} from "@entities/Admin/AdminEntity";

type TValidateAdminPasswordDto = Pick<IAdminEntity, "adminId"> & Partial<Pick<IAdminEntity, "password">>;

export interface ValidateAdminPasswordDto extends TValidateAdminPasswordDto {}

export class ValidateAdminPasswordDto {
    constructor(body: TValidateAdminPasswordDto) {
        this.adminId = body.adminId;
        this.password = body.password as string;
    }

    static create(body: TValidateAdminPasswordDto) {
        return new ValidateAdminPasswordDto(body);
    }
}
