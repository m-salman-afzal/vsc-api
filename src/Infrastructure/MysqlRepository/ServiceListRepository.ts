import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {ServiceList} from "@infrastructure/Database/Models/ServiceList";

import type {IServiceListRepository} from "@entities/ServiceList/IServiceListRepository";
import type {ServiceListEntity} from "@entities/ServiceList/ServiceListEntity";

@injectable()
export class ServiceListRepository
    extends BaseRepository<ServiceList, ServiceListEntity>
    implements IServiceListRepository
{
    constructor() {
        super(ServiceList);
    }
}
