import {In} from "typeorm";

import type {IServiceListEntity} from "@entities/ServiceList/ServiceListEntity";
import type {ServiceList} from "@infrastructure/Database/Models/ServiceList";
import type {TWhereFilter} from "@typings/ORM";

type TFilterServiceList = Omit<Partial<IServiceListEntity>, "serviceListId"> & {
    serviceListId?: string | string[];
};

type TWhereServiceList = TWhereFilter<ServiceList>;

export class ServiceListFilter {
    private where: TWhereServiceList;
    constructor(filters: TFilterServiceList) {
        this.where = {};

        this.setServiceListId(filters);
        this.setName(filters);
    }

    static setFilter(filters: TFilterServiceList) {
        return new ServiceListFilter(filters).where;
    }

    setServiceListId(filters: TFilterServiceList) {
        if (Array.isArray(filters.serviceListId)) {
            this.where.serviceListId = In(filters.serviceListId);

            return;
        }

        if (filters.serviceListId) {
            this.where.serviceListId = filters.serviceListId;
        }
    }

    setName(filters: TFilterServiceList) {
        if (filters.name) {
            this.where.name = filters.name;
        }
    }
}
