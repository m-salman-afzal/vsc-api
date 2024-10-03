import type {IAdminEntity} from "@entities/Admin/AdminEntity";
import type {IAdminRoleEntity} from "@entities/AdminRole/AdminRoleEntity";
import type {IRoleEntity} from "@entities/Role/RoleEntity";
import type {Role} from "@infrastructure/Database/Models/Role";
import type {TQueryBuilder} from "@src/typings/ORM";

export type TFilterRole = Partial<IRoleEntity> & Partial<IAdminEntity> & Partial<IAdminRoleEntity>;

type TQueryBuilderRole = TQueryBuilder<Role>;

export class RoleQueryBuilder {
    private query: TQueryBuilderRole;
    constructor(query: TQueryBuilderRole, filters: TFilterRole) {
        this.query = query;

        this.setRoleId(filters);
    }

    static setFilter(query: TQueryBuilderRole, filters) {
        return new RoleQueryBuilder(query, filters).query;
    }

    setRoleId(filters: TFilterRole) {
        if (filters.roleId) {
            this.query.andWhere("role.roleId = :roleId", {roleId: filters.roleId});
        }
    }
}
