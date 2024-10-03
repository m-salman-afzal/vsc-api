import {In} from "typeorm";

import type {IServiceDependencyEntity} from "@entities/ServiceDependency/ServiceDependencyEntity";
import type {ServiceDependency} from "@infrastructure/Database/Models/ServiceDependency";
import type {TWhereFilter} from "@typings/ORM";

type TFilterServiceDependency = Omit<Partial<IServiceDependencyEntity>, "serviceDependencyId"> & {
    serviceDependencyId?: string | string[];
};

type TWhereServiceDependency = TWhereFilter<ServiceDependency>;

export class ServiceDependencyFilter {
    private where: TWhereServiceDependency;
    constructor(filters: TFilterServiceDependency) {
        this.where = {};

        this.setServiceDependencyId(filters);
        this.setServiceDependsOnId(filters);
        this.setServiceId(filters);
    }

    static setFilter(filters: TFilterServiceDependency) {
        return new ServiceDependencyFilter(filters).where;
    }

    setServiceDependencyId(filters: TFilterServiceDependency) {
        if (Array.isArray(filters.serviceDependencyId)) {
            this.where.serviceDependencyId = In(filters.serviceDependencyId);

            return;
        }

        if (filters.serviceDependencyId) {
            this.where.serviceDependencyId = filters.serviceDependencyId;
        }
    }

    setServiceDependsOnId(filters: TFilterServiceDependency) {
        if (filters.serviceDependsOnId) {
            this.where.serviceDependsOnId = filters.serviceDependsOnId;
        }
    }

    setServiceId(filters: TFilterServiceDependency) {
        if (filters.serviceListId) {
            this.where.serviceListId = filters.serviceListId;
        }
    }
}
