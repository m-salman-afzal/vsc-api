import {In, Like} from "typeorm";

import type {IAdminEntity} from "@entities/Admin/AdminEntity";
import type {Admin} from "@infrastructure/Database/Models/Admin";
import type {TWhereFilter} from "@typings/ORM";

type TFilterAdmin = Partial<IAdminEntity> & {adminTypes?: string[] | undefined};
type TWhereAdmin = TWhereFilter<Admin>;

class AdminFilter {
    private where: TWhereAdmin;
    constructor(filters: TFilterAdmin) {
        this.where = {};

        this.setAdminId(filters);
        this.setFirstName(filters);
        this.setLastName(filters);
        this.setEmail(filters);
        this.setAdminType(filters);
        this.setResetPasswordToken(filters);
    }

    static setFilter(filters: TFilterAdmin) {
        return new AdminFilter(filters).where;
    }

    setAdminId(filters: TFilterAdmin) {
        if (filters.adminId) {
            this.where.adminId = filters.adminId;
        }
    }

    setFirstName(filters: TFilterAdmin) {
        if (filters.firstName) {
            this.where.firstName = Like(`%${filters.firstName}%`);
        }
    }

    setLastName(filters: TFilterAdmin) {
        if (filters.lastName) {
            this.where.lastName = Like(`%${filters.lastName}%`);
        }
    }

    setEmail(filters: TFilterAdmin) {
        if (filters.email) {
            this.where.email = filters.email;
        }
    }

    setAdminType(filters: TFilterAdmin) {
        if (filters.adminType) {
            this.where.adminType = filters.adminType;

            return;
        }
        if (filters.adminTypes) {
            this.where.adminType = In(filters.adminTypes);
        }
    }

    setResetPasswordToken(filters: TFilterAdmin) {
        if (filters.resetPasswordToken) {
            this.where.resetPasswordToken = filters.resetPasswordToken;
        }
    }
}

export default AdminFilter;
