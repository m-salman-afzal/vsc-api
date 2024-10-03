import type {IRoleEntity} from "@entities/Role/RoleEntity";

type TRemoveRoleDto = Pick<IRoleEntity, "roleId">;

export interface RemoveRoleDto extends TRemoveRoleDto {}

export class RemoveRoleDto {
    private constructor(body: TRemoveRoleDto) {
        this.roleId = body.roleId;
    }

    static create(body: unknown) {
        return new RemoveRoleDto(body as TRemoveRoleDto);
    }
}
