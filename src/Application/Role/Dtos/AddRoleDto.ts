import type {IRoleEntity} from "@entities/Role/RoleEntity";

type TAddRoleDto = Omit<IRoleEntity, "roleId"> & {defaultPermission: string};

export interface AddRoleDto extends TAddRoleDto {}

export class AddRoleDto {
    private constructor(body: TAddRoleDto) {
        this.name = body.name;
        this.position = body.position;
        this.defaultPermission = body.defaultPermission;
        this.colorCode = body.colorCode;
    }

    static create(body: unknown) {
        return new AddRoleDto(body as TAddRoleDto);
    }
}
