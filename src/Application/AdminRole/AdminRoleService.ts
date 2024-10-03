import async from "async";
import {inject, injectable} from "tsyringe";

import {AdminRoleEntity} from "@entities/AdminRole/AdminRoleEntity";

import {ORDER_BY} from "@appUtils/Constants";
import SharedUtils from "@appUtils/SharedUtils";

import {AdminRoleFilter} from "@repositories/Shared/ORM/AdminRoleFilter";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddAdminRoleDto} from "./Dtos/AddAdminRoleDto";
import type {GetAdminRoleDto} from "./Dtos/GetAdminRoleDto";
import type {RemoveAdminRoleDto} from "./Dtos/RemoveAdminRoleDto";
import type {UpdateAdminRoleDto} from "./Dtos/UpdateAdminRoleDto";
import type {IAdminRoleRepository} from "@entities/AdminRole/IAdminRoleRepository";
import type {AdminRole} from "@infrastructure/Database/Models/AdminRole";
import type {TSearchFilters} from "@typings/ORM";

@injectable()
export class AdminRoleService {
    constructor(@inject("IAdminRoleRepository") private adminRoleRepository: IAdminRoleRepository) {}

    async count(searchFilters: TSearchFilters<AdminRole>) {
        return await this.adminRoleRepository.count(searchFilters);
    }

    async fetchWithRoles(searchFilters: Omit<TSearchFilters<AdminRole>, "adminId"> & {adminId: string[]}) {
        return await this.adminRoleRepository.fetchWithRoles(searchFilters);
    }

    async subAddAdminRole(addAdminRoleDto: AddAdminRoleDto) {
        const searchFilters = AdminRoleFilter.setFilter(addAdminRoleDto);
        const isAdminRole = await this.adminRoleRepository.fetch(searchFilters);
        if (isAdminRole) {
            return false;
        }

        const adminRoleEntity = AdminRoleEntity.create(addAdminRoleDto);
        adminRoleEntity.adminRoleId = SharedUtils.shortUuid();
        await this.adminRoleRepository.create(adminRoleEntity);

        return adminRoleEntity;
    }

    async subGetAdminRole(getAdminRoleDto: GetAdminRoleDto) {
        const searchFilters = AdminRoleFilter.setFilter(getAdminRoleDto);
        const isAdminRole = await this.adminRoleRepository.fetchAll(searchFilters, {id: ORDER_BY.ASC});
        if (!isAdminRole) {
            return false;
        }

        return AdminRoleEntity.create(isAdminRole);
    }

    async subRemoveAdminRole(removeAdminRoleDto: RemoveAdminRoleDto) {
        const searchFilters = AdminRoleFilter.setFilter(removeAdminRoleDto);
        const isAdminRole = await this.adminRoleRepository.fetch(searchFilters);
        if (!isAdminRole) {
            return false;
        }

        return await this.adminRoleRepository.remove(searchFilters);
    }

    async subGetAdminRolesWithDeleted(getAdminRolesWithDeletedDto: GetAdminRoleDto) {
        const searchFilters = AdminRoleFilter.setFilter(getAdminRolesWithDeletedDto);
        const isAdminRoles = await this.adminRoleRepository.fetchAllWithDeleted(searchFilters);
        if (!isAdminRoles) {
            return false;
        }

        return isAdminRoles.map((ard) => AdminRoleEntity.create(ard));
    }

    async subRestoreAdminRole(restoreAdminRole: GetAdminRoleDto) {
        const searchFilters = AdminRoleFilter.setFilter(restoreAdminRole);
        const isAdminRole = await this.adminRoleRepository.restore(searchFilters);
        if (!isAdminRole) {
            return false;
        }

        return isAdminRole;
    }

    async subUpdateAdminRole(updateAdminRoleDto: UpdateAdminRoleDto) {
        const isDeletedAdminRoles = await this.adminRoleRepository.fetchAllWithDeleted({
            adminId: updateAdminRoleDto.adminId as string
        });
        if (!isDeletedAdminRoles) {
            return false;
        }

        const restoredAdminRoles = await this.toBeRestored(isDeletedAdminRoles, updateAdminRoleDto);

        const isAdminRoles = isDeletedAdminRoles.filter((dar) => !dar.deletedAt);
        const roleIds = isAdminRoles.map((iar) => iar.roleId);

        await this.toBeRemoved(roleIds, updateAdminRoleDto);

        await this.toBeAdded(roleIds, updateAdminRoleDto, restoredAdminRoles);

        return true;
    }

    private async toBeRestored(deletedAdminRoles: AdminRole[], updateAdminRoleDto: UpdateAdminRoleDto) {
        const adminRolesToBeRestored = deletedAdminRoles.filter(
            (dar) => dar.deletedAt && updateAdminRoleDto.roleId?.includes(dar.roleId)
        );
        await async.eachSeries(adminRolesToBeRestored, async (arr) => {
            try {
                await this.subRestoreAdminRole({adminId: updateAdminRoleDto.adminId as string, roleId: arr.roleId});
            } catch (error) {
                ErrorLog(error);
            }
        });

        return adminRolesToBeRestored;
    }

    private async toBeRemoved(roleIds: string[], updateAdminRoleDto: UpdateAdminRoleDto) {
        const roleIdsToBeRemoved = roleIds.filter((roleId) => !updateAdminRoleDto.roleId?.includes(roleId));
        await async.eachSeries(roleIdsToBeRemoved, async (roleId) => {
            try {
                await this.subRemoveAdminRole({
                    adminId: updateAdminRoleDto.adminId as string,
                    roleId: roleId as string
                });
            } catch (error) {
                await ErrorLog(error);
            }
        });
    }

    private async toBeAdded(
        roleIds: string[],
        updateAdminRoleDto: UpdateAdminRoleDto,
        restoredAdminRoles: AdminRole[]
    ) {
        const roleIdsToBeAdded = (updateAdminRoleDto.roleId as string[]).filter(
            (roleId) => !roleIds.includes(roleId) && !restoredAdminRoles?.find((fa) => fa.roleId === roleId)
        );
        await async.eachSeries(roleIdsToBeAdded, async (roleId) => {
            try {
                await this.subAddAdminRole({
                    adminId: updateAdminRoleDto.adminId as string,
                    roleId: roleId
                });
            } catch (error) {
                await ErrorLog(error);
            }
        });
    }
}
