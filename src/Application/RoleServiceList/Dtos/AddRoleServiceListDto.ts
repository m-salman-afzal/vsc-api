import type {IRoleServiceListEntity} from "@entities/RoleServiceList/RoleServiceListEntity";

type TAddRoleServiceListDto = Omit<IRoleServiceListEntity, "roleServiceId">;

export interface AddRoleServiceListDto extends TAddRoleServiceListDto {}

export class AddRoleServiceListDto {
    private constructor(body: TAddRoleServiceListDto) {
        this.roleId = body.roleId;
        this.serviceListId = body.serviceListId;
        this.permission = body.permission;
    }

    static create(body: unknown) {
        return new AddRoleServiceListDto(body as TAddRoleServiceListDto);
    }
}
