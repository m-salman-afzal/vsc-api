import {In} from "typeorm";

import type {IRoleEntity} from "@entities/Role/RoleEntity";
import type {Role} from "@infrastructure/Database/Models/Role";
import type {TWhereFilter} from "@typings/ORM";

type TFilterRole = Omit<Partial<IRoleEntity>, "roleId" | "name"> & {
    roleId?: string | string[];
    name?: string | string[];
};

type TWhereRole = TWhereFilter<Role>;

export class RoleFilter {
    private where: TWhereRole;
    constructor(filters: TFilterRole) {
        this.where = {};

        this.setRoleId(filters);
        this.setName(filters);
        this.setPosition(filters);
    }

    static setFilter(filters: TFilterRole) {
        return new RoleFilter(filters).where;
    }

    setRoleId(filters: TFilterRole) {
        if (Array.isArray(filters.roleId)) {
            this.where.roleId = In(filters.roleId);

            return;
        }

        if (filters.roleId) {
            this.where.roleId = filters.roleId;
        }
    }

    setName(filters: TFilterRole) {
        if (Array.isArray(filters.name)) {
            this.where.name = In(filters.name);

            return;
        }

        if (filters.name) {
            this.where.name = filters.name;
        }
    }

    setPosition(filters: TFilterRole) {
        if (filters.position) {
            this.where.position = filters.position;
        }
    }
}
