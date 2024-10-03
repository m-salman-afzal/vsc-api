import type {IAdminRoleEntity} from "@entities/AdminRole/AdminRoleEntity";
import type {AdminRole} from "@infrastructure/Database/Models/AdminRole";
import type {TQueryBuilder} from "@src/typings/ORM";

export type TFilterAdminRole = Partial<IAdminRoleEntity> & {facilityId: string};

type TQueryBuilderAdminRole = TQueryBuilder<AdminRole>;

export class AdminRoleQueryBuilder {
    private query: TQueryBuilderAdminRole;
    constructor(query: TQueryBuilderAdminRole, filters: TFilterAdminRole) {
        this.query = query;

        this.setAdminId(filters);
        this.setRoleId(filters);
        this.setFacilityId(filters);
    }

    static setFilter(query: TQueryBuilderAdminRole, filters) {
        return new AdminRoleQueryBuilder(query, filters).query;
    }

    setAdminId(filters: TFilterAdminRole) {
        if (Array.isArray(filters.adminId)) {
            this.query.andWhere("adminRole.adminId IN (:...adminId)", {adminId: filters.adminId});
        }
    }

    setRoleId(filters: TFilterAdminRole) {
        if (Array.isArray(filters.roleId)) {
            this.query.andWhere("adminRole.roleId IN (:...roleId)", {roleId: filters.roleId});

            return;
        }
        if (filters.roleId) {
            this.query.andWhere("adminRole.roleId = :roleId", {roleId: filters.roleId});
        }
    }

    setFacilityId(filters: TFilterAdminRole) {
        if (filters.facilityId) {
            this.query.andWhere("facilityAdmin.facilityId = :facilityId", {facilityId: filters.facilityId});
        }
    }
}
