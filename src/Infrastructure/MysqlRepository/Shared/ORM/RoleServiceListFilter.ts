import {In} from "typeorm";

import type {IRoleServiceListEntity} from "@entities/RoleServiceList/RoleServiceListEntity";
import type {RoleServiceList} from "@infrastructure/Database/Models/RoleServiceList";
import type {TWhereFilter} from "@typings/ORM";

type TFilterRoleServiceList = Partial<IRoleServiceListEntity>;

type TWhereRoleServiceList = TWhereFilter<RoleServiceList>;

export class RoleServiceListFilter {
    private where: TWhereRoleServiceList;
    constructor(filters: TFilterRoleServiceList) {
        this.where = {};

        this.setRoleServiceListId(filters);
        this.setRoleId(filters);
        this.setServiceId(filters);
    }

    static setFilter(filters: TFilterRoleServiceList) {
        return new RoleServiceListFilter(filters).where;
    }

    setRoleServiceListId(filters: TFilterRoleServiceList) {
        if (Array.isArray(filters.roleServiceListId)) {
            this.where.roleServiceListId = In(filters.roleServiceListId);

            return;
        }

        if (filters.roleServiceListId) {
            this.where.roleServiceListId = filters.roleServiceListId;
        }
    }

    setRoleId(filters: TFilterRoleServiceList) {
        if (filters.roleId) {
            this.where.roleId = filters.roleId;
        }
    }

    setServiceId(filters: TFilterRoleServiceList) {
        if (filters.serviceListId) {
            this.where.serviceListId = filters.serviceListId;
        }
    }
}
