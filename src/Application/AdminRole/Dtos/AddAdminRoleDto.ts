import type {IAdminRoleEntity} from "@entities/AdminRole/AdminRoleEntity";

type IAddAdminRoleDto = Omit<IAdminRoleEntity, "adminRoleId">;

export interface AddAdminRoleDto extends IAddAdminRoleDto {}
export class AddAdminRoleDto {
    private constructor(body: IAddAdminRoleDto) {
        this.adminId = body.adminId;
        this.roleId = body.roleId;
    }

    static create(body: unknown) {
        return new AddAdminRoleDto(body as IAddAdminRoleDto);
    }
}
