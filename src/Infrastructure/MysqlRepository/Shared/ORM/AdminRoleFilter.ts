import type {IAdminRoleEntity} from "@entities/AdminRole/AdminRoleEntity";
import type {AdminRole} from "@infrastructure/Database/Models/AdminRole";
import type {TWhereFilter} from "@typings/ORM";

export type TFilterAdminRole = Partial<IAdminRoleEntity> & {deletedAt?: string | null};
type TWhereAdminRole = TWhereFilter<AdminRole>;

export class AdminRoleFilter {
    private where: TWhereAdminRole;
    constructor(filters: TFilterAdminRole) {
        this.where = {};

        this.adminRoleId(filters);
        this.roleId(filters);
        this.adminId(filters);
    }

    static setFilter(filters: TFilterAdminRole) {
        return new AdminRoleFilter(filters).where;
    }

    adminRoleId(filters: TFilterAdminRole) {
        if (filters.adminRoleId) {
            this.where.adminRoleId = filters.adminRoleId;
        }
    }

    roleId(filters: TFilterAdminRole) {
        if (filters.roleId) {
            this.where.roleId = filters.roleId;
        }
    }

    adminId(filters: TFilterAdminRole) {
        if (filters.adminId) {
            this.where.adminId = filters.adminId;
        }
    }
}
