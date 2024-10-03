import async from "async";
import {inject, injectable} from "tsyringe";

import {RoleEntity} from "@entities/Role/RoleEntity";
import {RoleServiceListEntity} from "@entities/RoleServiceList/RoleServiceListEntity";
import {ServiceDependencyEntity} from "@entities/ServiceDependency/ServiceDependencyEntity";
import {ServiceListEntity} from "@entities/ServiceList/ServiceListEntity";

import {PERMISSION_PRIORITY} from "@constants/AuthConstant";

import {HttpMessages, HttpStatus, HttpStatusCode} from "@appUtils/Http";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {RoleServiceListFilter} from "@repositories/Shared/ORM/RoleServiceListFilter";

import {redisClient} from "@infrastructure/Database/RedisConnection";
import {roleService, serviceDependencyService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddRoleServiceListDto} from "./Dtos/AddRoleServiceListDto";
import type {RemoveRoleServiceListDto} from "./Dtos/RemoveRoleServiceListDto";
import type {TUpdateRoleServiceListDto} from "./Dtos/UpdateRoleServiceListDto";
import type {AdminEntity} from "@entities/Admin/AdminEntity";
import type {IRoleServiceListRepository} from "@entities/RoleServiceList/IRoleServiceListRepository";
import type {TRbacDependencyCheckOutput, TRbacDependencyCheckOutputGrouped} from "@typings/RbacDependencyCheckFunction";

@injectable()
export class RoleServiceListService {
    constructor(@inject("IRoleServiceListRepository") private roleServiceListRepository: IRoleServiceListRepository) {}

    async addRoleServiceList(addRoleServiceListDto: AddRoleServiceListDto) {
        try {
            const searchFilters = RoleServiceListFilter.setFilter({
                roleId: addRoleServiceListDto.roleId,
                roleServiceListId: addRoleServiceListDto.roleServiceListId
            });
            const roleServiceList = await this.roleServiceListRepository.fetchAll(searchFilters, {});
            if (roleServiceList) {
                return HttpResponse.conflict();
            }

            const roleServiceListEntity = RoleServiceListEntity.create(addRoleServiceListDto);
            roleServiceListEntity.roleServiceListId = SharedUtils.shortUuid();
            await this.roleServiceListRepository.create(roleServiceListEntity);

            return HttpResponse.created(roleServiceListEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getRoleServiceLists() {
        try {
            const roles = await roleService.getAllRolesWithServiceLists();
            if (!roles) {
                return HttpResponse.notFound();
            }

            const roleServiceListEntities = roles.map((r) => {
                return {
                    ...RoleEntity.create(r),
                    roleServiceList: r.roleServiceList.map((rs) => {
                        return {
                            ...RoleServiceListEntity.create(rs),
                            serviceList: ServiceListEntity.create(rs.serviceList)
                        };
                    })
                };
            });

            return HttpResponse.ok(roleServiceListEntities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subRemoveRoleServiceList(removeRoleServiceListDto: RemoveRoleServiceListDto) {
        const searchFilters = RoleServiceListFilter.setFilter(removeRoleServiceListDto);
        const roleServiceList = await this.roleServiceListRepository.fetch(searchFilters);
        if (!roleServiceList) {
            return false;
        }

        await this.roleServiceListRepository.remove(searchFilters);

        return true;
    }

    async removeRoleServiceList(removeRoleServiceListDto: RemoveRoleServiceListDto) {
        try {
            const roleServiceList = await this.subRemoveRoleServiceList(removeRoleServiceListDto);
            if (!roleServiceList) {
                return HttpResponse.notFound();
            }

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async updateRoleServiceList(updateRoleServiceListDto: TUpdateRoleServiceListDto[], loggedInAdmin?: AdminEntity) {
        try {
            let isCurrentAdmin = false;

            const isDepCheckFailed = await this.checkDependencies(updateRoleServiceListDto);

            if (isDepCheckFailed) {
                return HttpResponse.rbacDependencyError({
                    message: "Rbac dependency error see highlighted rows",
                    status: "error",
                    body: isDepCheckFailed
                });
            }

            await async.eachSeries(updateRoleServiceListDto, async (role) => {
                try {
                    await async.eachSeries(role.roleServiceList, async (rsl) => {
                        try {
                            const searchFilters = RoleServiceListFilter.setFilter({
                                roleServiceListId: rsl.roleServiceListId
                            });
                            const roleServiceList = await this.roleServiceListRepository.fetch(searchFilters);
                            if (!roleServiceList) {
                                return;
                            }

                            const roleServiceListEntity = RoleServiceListEntity.create(rsl);
                            await this.roleServiceListRepository.update(searchFilters, roleServiceListEntity);
                        } catch (error) {
                            ErrorLog(error);
                        }
                    });

                    const roles = await roleService.fetchWithAdmin({roleId: role.roleId});
                    if (!roles) {
                        return;
                    }

                    const sessionIds = roles.adminRole.map((ar) =>
                        ar.admin ? `fchSession:${ar.admin.sessionId}` : ""
                    );
                    sessionIds.length > 0 && (await redisClient.del(sessionIds));

                    const isAdmin = loggedInAdmin && roles.adminRole.find((ar) => ar.adminId === loggedInAdmin.adminId);
                    if (isAdmin) {
                        isCurrentAdmin = true;
                    }
                } catch (error) {
                    ErrorLog(error);
                }
            });

            if (isCurrentAdmin) {
                return HttpResponse.create(HttpStatusCode.NOT_AUTHORIZED, {
                    status: HttpStatus.ERROR,
                    message: HttpMessages.FORBIDDEN,
                    reload: true
                });
            }

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async bulkAddRoleServiceList(roleServiceListEntities: RoleServiceListEntity[]) {
        await this.roleServiceListRepository.bulkInsert(roleServiceListEntities);
    }

    async checkDependencies(updateRoleServiceListDto: TUpdateRoleServiceListDto[]) {
        try {
            const dependencies = await serviceDependencyService.fetchAll({}, {});
            if (!dependencies) {
                return false;
            }

            const dependencyEntities: ServiceDependencyEntity[] = dependencies.map((dep) => {
                const entity = ServiceDependencyEntity.create(dep);

                return entity;
            });

            const isCheckFailArray = updateRoleServiceListDto.map((dto) => {
                const dependencyFulfillmentList = dependencyEntities.map((dep) => {
                    const serviceDependsOn = dto.roleServiceList.find(
                        (rsl) => rsl.serviceListId === dep.serviceDependsOnId
                    );

                    if (!serviceDependsOn) {
                        return {
                            ...dep,
                            roleId: dto.roleId,
                            serviceListId: dep.serviceListId,
                            checkFailed: false
                        };
                    }

                    const serviceDependsOnPermission = PERMISSION_PRIORITY[serviceDependsOn?.permission];

                    const servicePermission =
                        PERMISSION_PRIORITY[
                            dto.roleServiceList.find((rsl) => rsl.serviceListId === dep.serviceListId)
                                ?.permission as string
                        ];

                    const checkIfPermissionInDtoFulfillsMinimumDependencies =
                        PERMISSION_PRIORITY[dep.minimumPermission] >= servicePermission &&
                        PERMISSION_PRIORITY[dep.minimumPermissionDependsOn] < serviceDependsOnPermission;

                    if (checkIfPermissionInDtoFulfillsMinimumDependencies) {
                        return {
                            ...dep,
                            roleId: dto.roleId,
                            dependencyOrRelationGroupId: dep.dependencyOrRelationGroupId,
                            checkFailed: true
                        };
                    }

                    return {
                        ...dep,
                        roleId: dto.roleId,
                        dependencyOrRelationGroupId: dep.dependencyOrRelationGroupId,
                        checkFailed: false
                    };
                });

                const filterGrouped = dependencyFulfillmentList.filter((dep) => dep.dependencyOrRelationGroupId);

                const reducedGroupItems = Object.values(
                    filterGrouped.reduce((acc: {[key: string]: TRbacDependencyCheckOutputGrouped}, item) => {
                        const {dependencyOrRelationGroupId, checkFailed} = item;

                        if (dependencyOrRelationGroupId) {
                            if (acc[dependencyOrRelationGroupId]) {
                                acc = {
                                    ...acc,
                                    [dependencyOrRelationGroupId]: {
                                        ...item,
                                        checkFailed: !!acc[dependencyOrRelationGroupId].checkFailed && !!checkFailed,
                                        serviceDependsOnIds: acc[dependencyOrRelationGroupId].serviceDependsOnIds
                                            ? [
                                                  ...acc[dependencyOrRelationGroupId].serviceDependsOnIds,
                                                  {
                                                      serviceDependsOnId: item.serviceDependsOnId,
                                                      minimumPermissionDependsOn: item.minimumPermissionDependsOn
                                                  }
                                              ]
                                            : [
                                                  {
                                                      serviceDependsOnId: item.serviceDependsOnId,
                                                      minimumPermissionDependsOn: item.minimumPermissionDependsOn
                                                  }
                                              ]
                                    }
                                };
                            } else {
                                acc = {
                                    ...acc,
                                    [dependencyOrRelationGroupId]: {
                                        ...item,
                                        serviceDependsOnIds: [
                                            {
                                                serviceDependsOnId: item.serviceDependsOnId,
                                                minimumPermissionDependsOn: item.minimumPermissionDependsOn
                                            }
                                        ]
                                    }
                                };
                            }
                        }

                        return acc;
                    }, {})
                );

                const checkIfAnyFalse = dependencyFulfillmentList.filter((list) => {
                    return list.checkFailed === true && !list.dependencyOrRelationGroupId;
                });

                const checkIfAnyFalseGroupItems = reducedGroupItems.filter((item) => item.checkFailed === true);

                return checkIfAnyFalse.length > 0 || checkIfAnyFalseGroupItems.length > 0
                    ? [...checkIfAnyFalse, ...checkIfAnyFalseGroupItems]
                    : false;
            });

            const flattenedRbacErrorData = isCheckFailArray
                .filter((dep) => dep)
                .flatMap((dep) => dep as TRbacDependencyCheckOutput[]);

            return flattenedRbacErrorData.length > 0 ? flattenedRbacErrorData : false;
        } catch (error) {
            ErrorLog(error);

            return false;
        }
    }
}
