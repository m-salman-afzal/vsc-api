import async from "async";
import {inject, injectable} from "tsyringe";

import {RoleEntity} from "@entities/Role/RoleEntity";
import {RoleServiceListEntity} from "@entities/RoleServiceList/RoleServiceListEntity";

import {ORDER_BY} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {RoleFilter} from "@repositories/Shared/ORM/RoleFilter";

import {adminRoleService, roleServiceListService, serviceListService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddRoleDto} from "./Dtos/AddRoleDto";
import type {GetRoleDto} from "./Dtos/GetRoleDto";
import type {RemoveRoleDto} from "./Dtos/RemoveRoleDto";
import type {TUpdateRoleDto} from "./Dtos/UpdateRoleDto";
import type {IRoleRepository} from "@entities/Role/IRoleRepository";
import type {TFilterRole} from "@repositories/Shared/Query/RoleQueryBuilder";

@injectable()
export class RoleService {
    constructor(@inject("IRoleRepository") private roleRepository: IRoleRepository) {}

    async fetchWithAdmin(searchFilters: TFilterRole) {
        return await this.roleRepository.fetchWithAdmin(searchFilters);
    }
    async addRole(addRoleDto: AddRoleDto) {
        try {
            const searchFilters = RoleFilter.setFilter({name: addRoleDto.name});
            const roles = await this.roleRepository.fetchAll(searchFilters, {});
            if (roles) {
                return HttpResponse.conflict();
            }

            const roleEntity = RoleEntity.create(addRoleDto);
            roleEntity.roleId = SharedUtils.shortUuid();

            const roleCount = await this.roleRepository.count({});
            roleEntity.position = roleCount + 1;
            await this.roleRepository.create(roleEntity);

            const serviceListEntities = await serviceListService.subGetServiceLists({});
            if (serviceListEntities) {
                const roleServiceListEntities = serviceListEntities.map((serviceListEntity) =>
                    RoleServiceListEntity.create({
                        roleServiceListId: SharedUtils.shortUuid(),
                        roleId: roleEntity.roleId,
                        serviceListId: serviceListEntity.serviceListId,
                        permission: addRoleDto.defaultPermission
                    })
                );
                await roleServiceListService.bulkAddRoleServiceList(roleServiceListEntities);
            }

            return HttpResponse.ok(RoleEntity.create(roleEntity));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subGetRoles(getRoleDto: GetRoleDto) {
        const searchFilters = RoleFilter.setFilter(getRoleDto);
        const roles = await this.roleRepository.fetchAll(searchFilters, {});
        if (!roles) {
            return false;
        }

        return roles.map((log) => RoleEntity.create(log));
    }

    async getRoles(getRoleDto: GetRoleDto) {
        try {
            const roleEntities = await this.subGetRoles(getRoleDto);
            if (!roleEntities) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok(roleEntities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async removeRole(removeRoleDto: RemoveRoleDto) {
        try {
            const searchFilters = RoleFilter.setFilter(removeRoleDto);
            const roles = await this.roleRepository.fetch(searchFilters);
            if (!roles) {
                return HttpResponse.notFound();
            }

            const adminRoleCount = await adminRoleService.count({roleId: roles.roleId});
            if (adminRoleCount > 0) {
                return HttpResponse.forbidden();
            }

            await this.roleRepository.remove(searchFilters);

            await roleServiceListService.subRemoveRoleServiceList({roleId: roles.roleId});

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async updateRole(updateRoleDto: TUpdateRoleDto[]) {
        try {
            await async.eachSeries(updateRoleDto, async (role) => {
                const searchFilters = RoleFilter.setFilter({roleId: role.roleId});
                const isRole = await this.roleRepository.fetch(searchFilters);
                if (!isRole) {
                    return;
                }
                if (
                    isRole.position === role.position &&
                    isRole.name === role.name &&
                    isRole.colorCode === role.colorCode
                ) {
                    return;
                }

                const roleEntity = RoleEntity.create({...isRole, ...role});
                await this.roleRepository.update(searchFilters, roleEntity);
            });

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getRolesById(searchBy: {roleId?: string | string[]}) {
        const searchFilter = RoleFilter.setFilter(searchBy);
        const roles =
            Object.keys(searchFilter).length > 0
                ? await this.roleRepository.fetchAll(searchFilter, {id: ORDER_BY.ASC})
                : false;
        if (!roles) {
            return false;
        }

        return roles.map((r) => RoleEntity.create(r));
    }

    async getAllRolesWithServiceLists() {
        const roles = await this.roleRepository.fetchAllByQuery();
        if (!roles) {
            return false;
        }

        return roles;
    }
}
