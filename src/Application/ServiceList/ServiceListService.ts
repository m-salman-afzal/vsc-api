import async from "async";
import {inject, injectable} from "tsyringe";

import {RoleServiceListEntity} from "@entities/RoleServiceList/RoleServiceListEntity";
import {ServiceListEntity} from "@entities/ServiceList/ServiceListEntity";

import {PERMISSIONS} from "@constants/AuthConstant";

import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {ServiceListFilter} from "@repositories/Shared/ORM/ServiceListFilter";

import {roleService, roleServiceListService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddServiceListDto} from "./Dtos/AddServiceListDto";
import type {GetServiceListDto} from "./Dtos/GetServiceListDto";
import type {RemoveServiceListDto} from "./Dtos/RemoveServiceListDto";
import type {UpdateServiceListDto} from "./Dtos/UpdateServiceListDto";
import type {IServiceListRepository} from "@entities/ServiceList/IServiceListRepository";

@injectable()
export class ServiceListService {
    constructor(@inject("IServiceListRepository") private serviceListRepository: IServiceListRepository) {}

    async addServiceList(addServiceListDto: AddServiceListDto) {
        try {
            const searchFilters = ServiceListFilter.setFilter({name: addServiceListDto.name});
            const serviceLists = await this.serviceListRepository.fetchAll(searchFilters, {});
            if (serviceLists) {
                return HttpResponse.conflict();
            }
            const serviceListEntity = await this.subAddServiceList(addServiceListDto);

            return HttpResponse.created(serviceListEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subAddServiceList(addServiceListDto) {
        const serviceListEntity = ServiceListEntity.create(addServiceListDto);
        serviceListEntity.serviceListId = SharedUtils.shortUuid();
        await this.serviceListRepository.create(serviceListEntity);

        const roleEntities = await roleService.subGetRoles({});
        if (roleEntities) {
            const roleServiceListEntities = roleEntities.map((roleEntity) =>
                RoleServiceListEntity.create({
                    roleServiceListId: SharedUtils.shortUuid(),
                    roleId: roleEntity.roleId,
                    serviceListId: serviceListEntity.serviceListId,
                    permission: PERMISSIONS.HIDE
                })
            );
            await roleServiceListService.bulkAddRoleServiceList(roleServiceListEntities);
        }

        return serviceListEntity;
    }

    async subGetServiceLists(getServiceListDto: GetServiceListDto) {
        const searchFilters = ServiceListFilter.setFilter(getServiceListDto);
        const serviceLists = await this.serviceListRepository.fetchAll(searchFilters, {});
        if (!serviceLists) {
            return false;
        }

        return serviceLists.map((log) => ServiceListEntity.create(log));
    }

    async getServiceLists(getServiceListDto: GetServiceListDto) {
        try {
            const serviceListEntities = await this.subGetServiceLists(getServiceListDto);
            if (!serviceListEntities) {
                return HttpResponse.notFound();
            }

            return HttpResponse.created(serviceListEntities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async removeServiceList(removeServiceListDto: RemoveServiceListDto) {
        try {
            const searchFilters = ServiceListFilter.setFilter(removeServiceListDto);
            const serviceLists = await this.serviceListRepository.fetch(searchFilters);
            if (!serviceLists) {
                return HttpResponse.notFound();
            }

            await this.serviceListRepository.remove(searchFilters);

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async updateServiceList(updateServiceListDto: UpdateServiceListDto) {
        try {
            const searchFilters = ServiceListFilter.setFilter(updateServiceListDto);
            const serviceLists = await this.serviceListRepository.fetch(searchFilters);
            if (!serviceLists) {
                return HttpResponse.notFound();
            }

            const serviceListEntity = ServiceListEntity.create(updateServiceListDto);
            await this.serviceListRepository.update(searchFilters, serviceListEntity);

            return HttpResponse.ok(serviceListEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async addRbacServiceLists(services) {
        try {
            const serviceLists = await this.serviceListRepository.fetchAll({}, {});

            if (!serviceLists) {
                return;
            }
            const serviceListEntities = serviceLists.map((s) => s.name);
            const rbacServices = services.filter((s) => !serviceListEntities.includes(s));

            await async.eachSeries(rbacServices, async (rs) => {
                await this.subAddServiceList({name: rs});
            });
        } catch (error) {
            ErrorLog(error);
        }
    }
}
