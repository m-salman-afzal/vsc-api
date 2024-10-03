import type {IRoleEntity} from "@entities/Role/RoleEntity";
import type {IRoleServiceListEntity} from "@entities/RoleServiceList/RoleServiceListEntity";
import type {IServiceListEntity} from "@entities/ServiceList/ServiceListEntity";

export type TUpdateRoleServiceListDto = IRoleEntity & {
    roleServiceList: Array<IRoleServiceListEntity & {serviceList: IServiceListEntity}>;
};

export interface UpdateRoleServiceListDto extends TUpdateRoleServiceListDto {}

export class UpdateRoleServiceListDto {
    private dto: TUpdateRoleServiceListDto[];
    private constructor(body: TUpdateRoleServiceListDto[]) {
        this.dto = body.map((b) => {
            const role = {} as TUpdateRoleServiceListDto;
            role.name = b.name;
            role.roleId = b.roleId;
            role.position = b.position;
            role.roleServiceList = b.roleServiceList.map((rs) => {
                return {
                    roleServiceListId: rs.roleServiceListId,
                    roleId: rs.roleId,
                    serviceListId: rs.serviceListId,
                    permission: rs.permission,
                    serviceList: {
                        serviceListId: rs.serviceList.serviceListId,
                        name: rs.serviceList.name
                    }
                };
            });

            return role;
        });
    }

    static create(body: unknown) {
        return new UpdateRoleServiceListDto(body as TUpdateRoleServiceListDto[]).dto;
    }
}
