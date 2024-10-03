import {inject, injectable} from "tsyringe";

import {ServiceDependencyEntity} from "@entities/ServiceDependency/ServiceDependencyEntity";

import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {ServiceDependencyFilter} from "@repositories/Shared/ORM/serviceDependencyFilter";
import {ServiceListFilter} from "@repositories/Shared/ORM/ServiceListFilter";

import {serviceListService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddServiceDependencyDto} from "./Dtos/AddServiceDependencyDto";
import type {GetServiceListDto} from "@application/ServiceList/Dtos/GetServiceListDto";
import type {IServiceDependencyRepository} from "@entities/ServiceDependency/IServiceDependencyRepository";
import type {ServiceDependency} from "@infrastructure/Database/Models/ServiceDependency";

@injectable()
export class ServiceDependencyService extends BaseService<ServiceDependency, ServiceDependencyEntity> {
    constructor(@inject("IServiceDependencyRepository") serviceDependencyRepository: IServiceDependencyRepository) {
        super(serviceDependencyRepository);
    }

    async addDependency(addDependencyDto: AddServiceDependencyDto) {
        try {
            const serviceListFilters = ServiceListFilter.setFilter({
                serviceListId: [addDependencyDto.serviceDependsOnId, addDependencyDto.serviceListId]
            });

            const serviceList = await serviceListService.subGetServiceLists(serviceListFilters as GetServiceListDto);
            if (!serviceList) {
                return HttpResponse.notFound();
            }
            const serviceDepndencyFilters = ServiceDependencyFilter.setFilter(addDependencyDto);
            const serviceDepencies = await this.fetchAll(serviceDepndencyFilters, {});
            if (serviceDepencies) {
                return HttpResponse.conflict();
            }

            const serviceDependencyEntity = ServiceDependencyEntity.create(addDependencyDto);
            serviceDependencyEntity.serviceDependencyId = SharedUtils.shortUuid();
            await this.create(serviceDependencyEntity);

            return HttpResponse.created(serviceDependencyEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
