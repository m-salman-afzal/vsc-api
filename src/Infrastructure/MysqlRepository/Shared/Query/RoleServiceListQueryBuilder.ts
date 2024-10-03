import type {IRoleServiceListEntity} from "@entities/RoleServiceList/RoleServiceListEntity";
import type {RoleServiceList} from "@infrastructure/Database/Models/RoleServiceList";
import type {TQueryBuilder} from "@typings/ORM";

export type TFilterRoleServiceList = Partial<IRoleServiceListEntity> & {permissions: string[]};
type TQueryBuilderRoleServiceList = TQueryBuilder<RoleServiceList>;

export class RoleServiceListQueryBuilder {
    private query: TQueryBuilderRoleServiceList;
    constructor(query: TQueryBuilderRoleServiceList, filters: TFilterRoleServiceList) {
        this.query = query;
        this.setPermission(filters);
        this.setServiceListId(filters);
    }

    static setFilter(query: TQueryBuilderRoleServiceList, filters) {
        return new RoleServiceListQueryBuilder(query, filters).query;
    }

    setPermission(filters: TFilterRoleServiceList) {
        if (Array.isArray(filters.permissions)) {
            this.query.andWhere("roleServiceList.permission IN (:...permission)", {
                permission: filters.permissions
            });
        }
    }

    setServiceListId(filters: TFilterRoleServiceList) {
        if (filters.serviceListId) {
            this.query.andWhere("roleServiceList.serviceListId = :serviceListId", {
                serviceListId: filters.serviceListId
            });
        }
    }
}
