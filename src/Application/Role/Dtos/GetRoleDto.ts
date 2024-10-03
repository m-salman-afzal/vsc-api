import type {IRoleEntity} from "@entities/Role/RoleEntity";

type TGetRoleDto = Omit<Partial<IRoleEntity>, "roleId" | "name"> & {
    roleId?: string | string[];
    name?: string | string[];
};

export interface GetRoleDto extends TGetRoleDto {}

export class GetRoleDto {
    private constructor(body: TGetRoleDto) {
        this.roleId = body.roleId as string | string[];
        this.name = body.name as string | string[];
        this.position = body.position as number;
        this.colorCode = body.colorCode as string;
    }

    static create(body: unknown) {
        return new GetRoleDto(body as TGetRoleDto);
    }
}
