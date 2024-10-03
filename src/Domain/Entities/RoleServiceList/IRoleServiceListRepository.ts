import type IBaseRepository from "@entities/IBaseRepository";
import type {RoleServiceListEntity} from "@entities/RoleServiceList/RoleServiceListEntity";
import type {RoleServiceList} from "@infrastructure/Database/Models/RoleServiceList";
import type {TFilterRoleServiceList} from "@repositories/Shared/Query/RoleServiceListQueryBuilder";

export interface IRoleServiceListRepository extends IBaseRepository<RoleServiceList, RoleServiceListEntity> {
    fetchAllByQuery(): Promise<false | RoleServiceList[]>;
    fetchAllByPermission(searchFilter: TFilterRoleServiceList): Promise<false | RoleServiceList[]>;
}
