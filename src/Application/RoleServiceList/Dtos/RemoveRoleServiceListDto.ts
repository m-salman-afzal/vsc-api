import type {IRoleServiceListEntity} from "@entities/RoleServiceList/RoleServiceListEntity";

type TRemoveRoleServiceListDto = Partial<IRoleServiceListEntity>;

export interface RemoveRoleServiceListDto extends TRemoveRoleServiceListDto {}

export class RemoveRoleServiceListDto {
    private constructor(body: TRemoveRoleServiceListDto) {
        this.roleServiceListId = body.roleServiceListId as string;
        this.roleId = body.roleId as string;
        this.serviceListId = body.serviceListId as string;
    }

    static create(body: unknown) {
        return new RemoveRoleServiceListDto(body as TRemoveRoleServiceListDto);
    }
}
