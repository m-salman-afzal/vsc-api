import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {RoleServiceList} from "@infrastructure/Database/Models/RoleServiceList";

import {RoleServiceListQueryBuilder} from "./Shared/Query/RoleServiceListQueryBuilder";

import type {TFilterRoleServiceList} from "./Shared/Query/RoleServiceListQueryBuilder";
import type {IRoleServiceListRepository} from "@entities/RoleServiceList/IRoleServiceListRepository";
import type {RoleServiceListEntity} from "@entities/RoleServiceList/RoleServiceListEntity";

@injectable()
export class RoleServiceListRepository
    extends BaseRepository<RoleServiceList, RoleServiceListEntity>
    implements IRoleServiceListRepository
{
    constructor() {
        super(RoleServiceList);
    }

    async fetchAllByQuery() {
        const query = this.model
            .createQueryBuilder("roleServiceList")
            .leftJoinAndSelect("roleServiceList.role", "role")
            .leftJoinAndSelect("roleServiceList.serviceList", "serviceList")
            .where("1=1");

        const rows = await query.getMany();

        if (rows.length === 0) {
            return false;
        }

        return rows;
    }

    async fetchAllByPermission(searchFilters: TFilterRoleServiceList) {
        const query = this.model.createQueryBuilder("roleServiceList");

        const queryFilters = RoleServiceListQueryBuilder.setFilter(query, searchFilters);
        const rows = await queryFilters.getMany();

        if (rows.length === 0) {
            return false;
        }

        return rows;
    }
}
