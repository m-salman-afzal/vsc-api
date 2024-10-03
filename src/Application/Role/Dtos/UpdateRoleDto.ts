import type {IRoleEntity} from "@entities/Role/RoleEntity";

export type TUpdateRoleDto = Pick<IRoleEntity, "roleId"> & Partial<Omit<IRoleEntity, "roleId">>;

export interface UpdateRoleDto extends TUpdateRoleDto {}

export class UpdateRoleDto {
    private dto: TUpdateRoleDto[];
    private constructor(body: TUpdateRoleDto[]) {
        this.dto = body.map((b) => {
            const role = {} as TUpdateRoleDto;
            role.roleId = b.roleId;
            role.name = (b.name as string) && (b.name as string).trim();
            role.position = b.position as number;
            role.colorCode = b.colorCode as string;

            return role;
        });
    }

    static create(body: unknown) {
        return new UpdateRoleDto(body as TUpdateRoleDto[]).dto;
    }
}
