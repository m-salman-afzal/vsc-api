import type {IAdminRoleEntity} from "@entities/AdminRole/AdminRoleEntity";

type IGetAdminRoleDto = Partial<IAdminRoleEntity>;

export interface GetAdminRoleDto extends IGetAdminRoleDto {}
export class GetAdminRoleDto {
    private constructor(body: IGetAdminRoleDto) {
        this.adminId = body.adminId as string;
        this.roleId = body.roleId as string;
        this.adminRoleId = body.adminRoleId as string;
    }

    static create(body: unknown) {
        return new GetAdminRoleDto(body as IGetAdminRoleDto);
    }
}
