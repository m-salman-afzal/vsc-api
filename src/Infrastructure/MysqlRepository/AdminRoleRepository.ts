import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {AdminRole} from "@infrastructure/Database/Models/AdminRole";

import {AdminRoleQueryBuilder} from "./Shared/Query/AdminRoleQueryBuilder";

import type {AdminRoleEntity} from "@entities/AdminRole/AdminRoleEntity";
import type {IAdminRoleRepository, TFetchWithRolesFilter} from "@entities/AdminRole/IAdminRoleRepository";

@injectable()
export class AdminRoleRepository extends BaseRepository<AdminRole, AdminRoleEntity> implements IAdminRoleRepository {
    constructor() {
        super(AdminRole);
    }

    async fetchWithRoles(searchFilters: TFetchWithRolesFilter) {
        const query = this.model.createQueryBuilder("adminRole").leftJoinAndSelect("adminRole.role", "role");

        const queryFilters = AdminRoleQueryBuilder.setFilter(query, searchFilters);

        const rows = await queryFilters.getMany();

        if (rows.length === 0) {
            return false;
        }

        return rows;
    }

    async fetchWithAdmins(searchFilters: TFetchWithRolesFilter) {
        const query = this.model
            .createQueryBuilder("adminRole")
            .leftJoinAndSelect("adminRole.admin", "admin")
            .leftJoinAndSelect("admin.facilityAdmin", "facilityAdmin");

        const queryFilters = AdminRoleQueryBuilder.setFilter(query, searchFilters);

        const rows = await queryFilters.getMany();

        if (rows.length === 0) {
            return false;
        }

        return rows;
    }
}
