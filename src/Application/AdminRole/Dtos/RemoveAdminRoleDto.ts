import type {IAdminRoleEntity} from "@entities/AdminRole/AdminRoleEntity";

type IRemoveAdminRoleDto = Partial<IAdminRoleEntity>;

export interface RemoveAdminRoleDto extends IRemoveAdminRoleDto {}
export class RemoveAdminRoleDto {
    private constructor(body: IRemoveAdminRoleDto) {
        this.adminRoleId = body.adminRoleId as string;
        this.adminId = body.adminId as string;
        this.roleId = body.roleId as string;
    }

    static create(body: unknown) {
        return new RemoveAdminRoleDto(body as IRemoveAdminRoleDto);
    }
}
