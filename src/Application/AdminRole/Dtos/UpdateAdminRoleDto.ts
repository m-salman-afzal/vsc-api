import type {IAdminRoleEntity} from "@entities/AdminRole/AdminRoleEntity";

type IUpdateAdminRoleDto = Partial<Pick<IAdminRoleEntity, "adminId" | "adminRoleId"> & {roleId?: string | string[]}>;

export interface UpdateAdminRoleDto extends IUpdateAdminRoleDto {}
export class UpdateAdminRoleDto {
    private constructor(body: IUpdateAdminRoleDto) {
        this.adminRoleId = body.adminRoleId as string;
        this.adminId = body.adminId as string;
        this.roleId = body.roleId as string | string[];
    }

    static create(body: unknown) {
        return new UpdateAdminRoleDto(body as IUpdateAdminRoleDto);
    }
}
