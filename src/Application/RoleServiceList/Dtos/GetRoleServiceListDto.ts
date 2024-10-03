import type {IRoleServiceListEntity} from "@entities/RoleServiceList/RoleServiceListEntity";

type TGetRoleServiceListDto = Partial<IRoleServiceListEntity>;

export interface GetRoleServiceListDto extends TGetRoleServiceListDto {}

export class GetRoleServiceListDto {
    private constructor(body: TGetRoleServiceListDto) {
        this.serviceListId = body.serviceListId as string;
        this.roleId = body.roleId as string;
        this.permission = body.permission as string;
        this.roleServiceListId = body.roleServiceListId as string;
    }

    static create(body: unknown) {
        return new GetRoleServiceListDto(body as TGetRoleServiceListDto);
    }
}
