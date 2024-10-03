import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";
import {AdminQueryBuilder} from "@repositories/Shared/Query/AdminQueryBuilder";
import {SEARCH_ADMIN_REPOSITORY_FIELDS} from "@repositories/Shared/Query/FieldsBuilder";

import {Admin} from "@infrastructure/Database/Models/Admin";

import type {AdminEntity} from "@entities/Admin/AdminEntity";
import type {IAdminRepository, TFetchAdminFilter} from "@entities/Admin/IAdminRepository";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TFilterAdmin} from "@repositories/Shared/Query/AdminQueryBuilder";

@injectable()
export class AdminRepository extends BaseRepository<Admin, AdminEntity> implements IAdminRepository {
    constructor() {
        super(Admin);
    }

    async fetchBySearchQuery(searchFilters: TFilterAdmin) {
        const query = this.model
            .createQueryBuilder("admin")
            .leftJoin("admin.facilityAdmin", "facilityAdmin")
            .leftJoin("facilityAdmin.facility", "facility")
            .leftJoin("admin.userSetting", "userSetting")
            .where("1=1")
            .orderBy("admin.lastName", "ASC");

        const queryFilters = AdminQueryBuilder.setFilter(query, searchFilters);

        const admin = await queryFilters.select(SEARCH_ADMIN_REPOSITORY_FIELDS).getRawMany();

        if (admin.length === 0) {
            return false;
        }

        return admin;
    }

    async fetchAllByQueryWithRoleServiceList(searchFilters: TFilterAdmin) {
        const query = this.model
            .createQueryBuilder("admin")
            .leftJoinAndSelect("admin.facilityAdmin", "facilityAdmin")
            .leftJoinAndSelect("facilityAdmin.facility", "facility")
            .leftJoinAndSelect("admin.userSetting", "userSetting")
            .leftJoinAndSelect("admin.adminRole", "adminRole")
            .leftJoinAndSelect("adminRole.role", "role")
            .leftJoinAndSelect("role.roleServiceList", "roleServiceList")
            .leftJoinAndSelect("roleServiceList.serviceList", "serviceList")
            .where("1=1")
            .orderBy("admin.lastName", "ASC");

        const queryFilters = AdminQueryBuilder.setFilter(query, searchFilters);

        const admin = await queryFilters.getMany();

        if (!admin) {
            return false;
        }

        return admin;
    }

    async fetchByQuery(searchFilters: TFilterAdmin) {
        const query = this.model
            .createQueryBuilder("admin")
            .leftJoinAndSelect("admin.facilityAdmin", "facilityAdmin")
            .leftJoinAndSelect("facilityAdmin.facility", "facility")
            .leftJoinAndSelect("admin.userSetting", "userSetting")
            .leftJoinAndSelect("admin.adminRole", "adminRole")
            .leftJoinAndSelect("adminRole.role", "role")
            .leftJoinAndSelect("role.roleServiceList", "roleServiceList")
            .leftJoinAndSelect("roleServiceList.serviceList", "serviceList")
            .where("1=1")
            .orderBy("admin.lastName", "ASC");

        const queryFilters = AdminQueryBuilder.setFilter(query, searchFilters);

        const admin = await queryFilters.getOne();

        if (!admin) {
            return false;
        }

        return admin;
    }

    async fetchAllAdminsOnlyByQuery(searchFilters: TFetchAdminFilter) {
        const query = this.model.createQueryBuilder("admin").orderBy("admin.lastName", "ASC");

        const queryFilters = AdminQueryBuilder.setFilter(query, searchFilters);

        const admin = await queryFilters.getMany();

        if (admin.length === 0) {
            return false;
        }

        return admin;
    }

    async fetchAllByQuery(searchFilters: TFilterAdmin) {
        const query = this.model
            .createQueryBuilder("admin")
            .leftJoinAndSelect("admin.facilityAdmin", "facilityAdmin")
            .leftJoinAndSelect("facilityAdmin.facility", "facility")
            .leftJoinAndSelect("admin.userSetting", "userSetting")
            .leftJoinAndSelect("admin.adminRole", "adminRole")
            .leftJoinAndSelect("adminRole.role", "role")
            .where("1=1")
            .orderBy("admin.lastName", "ASC");

        const queryFilters = AdminQueryBuilder.setFilter(query, searchFilters);

        const admin = await queryFilters.getMany();

        if (admin.length === 0) {
            return false;
        }

        return admin;
    }

    async fetchPaginatedByQuery(searchFilters: TFilterAdmin, pagination: PaginationOptions) {
        const query = this.model
            .createQueryBuilder("admin")
            .leftJoin("admin.facilityAdmin", "facilityAdmin")
            .leftJoin("facilityAdmin.facility", "facility")
            .leftJoinAndSelect("admin.adminRole", "adminRole")
            .leftJoinAndSelect("adminRole.role", "role")
            .leftJoinAndSelect("role.roleServiceList", "roleServiceList")
            .leftJoinAndSelect("roleServiceList.serviceList", "serviceList")
            .take(pagination.perPage)
            .skip(pagination.offset)
            .orderBy("admin.lastName", "ASC");

        const countQuery = this.model
            .createQueryBuilder("admin")
            .leftJoin("admin.facilityAdmin", "facilityAdmin")
            .leftJoin("facilityAdmin.facility", "facility");

        const queryFilters = AdminQueryBuilder.setFilter(query, searchFilters);
        const countFilters = AdminQueryBuilder.setFilter(countQuery, searchFilters);

        const admins = await queryFilters.getMany();
        const adminsCount = await countFilters.getCount();
        if (!admins.length) {
            return false;
        }

        return {count: adminsCount, rows: admins};
    }

    async fetchAllCartRequestAllocatedBy() {
        const query = this.model
            .createQueryBuilder("admin")
            .innerJoinAndSelect("admin.allocatedByCartRequestDrug", "allocatedByCartRequestDrug")
            .orderBy("admin.lastName", "ASC");

        const rows = await query.getMany();

        if (rows.length === 0) {
            return false;
        }

        return rows;
    }

    async fetchAllCartRequestOrderedBy() {
        const query = this.model
            .createQueryBuilder("admin")
            .innerJoinAndSelect("admin.cartRequestLog", "cartRequestLog")
            .where("cartRequestLog.type = 'STANDARD'")
            .orderBy("admin.lastName", "ASC");

        const rows = await query.getMany();

        if (rows.length === 0) {
            return false;
        }

        return rows;
    }

    async fetchAllForBridgeTherapy(searchFilters: TFilterAdmin) {
        const query = this.model
            .createQueryBuilder("admin")
            .innerJoin("admin.bridgeTherapyLog", "bridgeTherapyLog")
            .orderBy("admin.lastName", "ASC");

        const queryFilters = AdminQueryBuilder.setFilter(query, searchFilters);

        const admin = await queryFilters.getMany();

        if (admin.length === 0) {
            return false;
        }

        return admin;
    }
}
