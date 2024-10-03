import {Brackets} from "typeorm";

import type {IAdminEntity} from "@entities/Admin/AdminEntity";
import type {IAdminRoleEntity} from "@entities/AdminRole/AdminRoleEntity";
import type {IFacilityEntity} from "@entities/Facility/FacilityEntity";
import type {Admin} from "@infrastructure/Database/Models/Admin";
import type {TQueryBuilder} from "@src/typings/ORM";

export type TFilterAdmin = Partial<IAdminEntity> &
    Partial<IFacilityEntity> &
    Partial<IAdminRoleEntity> & {
        adminTypes?: string[];
        role?: string[];
        notAdminType?: string[];
        text?: string | undefined;
        serviceName?: string;
        permission?: string | string[];
        bridgeTherapyFacilityId?: string;
    };
type TQueryBuilderAdmin = TQueryBuilder<Admin>;

export class AdminQueryBuilder {
    private query: TQueryBuilderAdmin;
    constructor(query: TQueryBuilderAdmin, filters: TFilterAdmin) {
        this.query = query;

        this.setAdminId(filters);
        this.setFacilityId(filters);
        this.setFirstName(filters);
        this.setLastName(filters);
        this.setEmail(filters);
        this.setAdminType(filters);
        this.setRole(filters);
        this.setText(filters);
        this.setServiceName(filters);
        this.setPermission(filters);
        this.setBridgeTherapyFacilityId(filters);
    }

    static setFilter(query: TQueryBuilderAdmin, filters) {
        return new AdminQueryBuilder(query, filters).query;
    }

    setAdminId(filters: TFilterAdmin) {
        if (Array.isArray(filters.adminId)) {
            this.query.andWhere("admin.adminId IN (:...adminId)", {adminId: filters.adminId});

            return;
        }

        if (filters.adminId) {
            this.query.andWhere("admin.adminId = :adminId", {adminId: filters.adminId});
        }
    }

    setFacilityId(filters: TFilterAdmin) {
        if (filters.facilityId) {
            this.query.andWhere("facility.facilityId = :facilityId", {facilityId: filters.facilityId});
        }
    }

    setText(filters: TFilterAdmin) {
        if (filters.text) {
            this.query.andWhere(
                new Brackets((qb) => {
                    qb.orWhere("admin.firstName LIKE :text", {text: `%${filters.text}%`});
                    qb.orWhere("admin.lastName LIKE :text", {text: `%${filters.text}%`});
                })
            );
        }
    }

    setFirstName(filters: TFilterAdmin) {
        if (filters.firstName) {
            this.query.andWhere(
                new Brackets((qb) => {
                    qb.orWhere("admin.firstName LIKE :firstName", {firstName: `%${filters.firstName}%`});
                    qb.orWhere("admin.lastName LIKE :firstName", {firstName: `%${filters.firstName}%`});
                })
            );
        }
    }

    setLastName(filters: TFilterAdmin) {
        if (filters.lastName) {
            this.query.andWhere(
                new Brackets((qb) => {
                    qb.orWhere("admin.lastName LIKE :lastName", {lastName: `%${filters.lastName}%`});
                    qb.orWhere("admin.firstName LIKE :lastName", {lastName: `%${filters.lastName}%`});
                })
            );
        }
    }

    setAdminType(filters: TFilterAdmin) {
        if (filters.notAdminType) {
            this.query.andWhere("admin.adminType NOT IN (:...notAdminType)", {notAdminType: filters.notAdminType});

            return;
        }

        if (filters.adminType) {
            this.query.andWhere("admin.adminType = :adminType", {adminType: filters.adminType});

            return;
        }

        if (filters.adminTypes) {
            this.query.andWhere("admin.adminType IN (:...adminTypes)", {adminTypes: filters.adminTypes});
        }
    }

    setEmail(filters: TFilterAdmin) {
        if (filters.email) {
            this.query.andWhere("admin.email = :email", {email: filters.email});
        }
    }

    setRole(filters: TFilterAdmin) {
        if (filters.role) {
            this.query.andWhere("role.name = :role", {role: filters.role});
        }
    }

    setServiceName(filters: TFilterAdmin) {
        if (filters.serviceName) {
            this.query.andWhere("serviceList.name = :name", {name: filters.serviceName});
        }
    }

    setPermission(filters: TFilterAdmin) {
        if (Array.isArray(filters.permission)) {
            this.query.andWhere("roleServiceList.permission IN (:...permission)", {permission: filters.permission});

            return;
        }
        if (filters.permission) {
            this.query.andWhere("roleServiceList.permission = :permission", {permission: filters.permission});
        }
    }

    setBridgeTherapyFacilityId(filters: TFilterAdmin) {
        if (filters.bridgeTherapyFacilityId) {
            this.query.andWhere("bridgeTherapyLog.facilityId = :bridgeTherapyFacilityId", {
                bridgeTherapyFacilityId: filters.bridgeTherapyFacilityId
            });
        }
    }
}
