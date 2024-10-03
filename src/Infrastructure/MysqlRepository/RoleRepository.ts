import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {Role} from "@infrastructure/Database/Models/Role";

import {RoleQueryBuilder} from "./Shared/Query/RoleQueryBuilder";

import type {TFilterRole} from "./Shared/Query/RoleQueryBuilder";
import type {IRoleRepository} from "@entities/Role/IRoleRepository";
import type {RoleEntity} from "@entities/Role/RoleEntity";

@injectable()
export class RoleRepository extends BaseRepository<Role, RoleEntity> implements IRoleRepository {
    constructor() {
        super(Role);
    }

    async fetchAllByQuery() {
        const query = this.model
            .createQueryBuilder("role")
            .leftJoinAndSelect("role.roleServiceList", "roleServiceList")
            .leftJoinAndSelect("roleServiceList.serviceList", "serviceList")
            .where("1=1")
            .orderBy("role.position", "ASC");

        const rows = await query.getMany();

        if (rows.length === 0) {
            return false;
        }

        return rows;
    }

    async fetchWithAdmin(searchFilters: TFilterRole) {
        const query = this.model
            .createQueryBuilder("role")
            .leftJoinAndSelect("role.adminRole", "adminRole")
            .leftJoinAndSelect("adminRole.admin", "admin")
            .where("1=1");

        const queryFilters = RoleQueryBuilder.setFilter(query, searchFilters);

        const row = await queryFilters.getOne();

        if (!row) {
            return false;
        }

        return row;
    }
}
