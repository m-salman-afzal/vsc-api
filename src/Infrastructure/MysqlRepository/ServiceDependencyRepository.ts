import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {ServiceDependency} from "@infrastructure/Database/Models/ServiceDependency";

import type {IServiceDependencyRepository} from "@entities/ServiceDependency/IServiceDependencyRepository";
import type {ServiceDependencyEntity} from "@entities/ServiceDependency/ServiceDependencyEntity";

@injectable()
export class ServiceDependencyRepository
    extends BaseRepository<ServiceDependency, ServiceDependencyEntity>
    implements IServiceDependencyRepository
{
    constructor() {
        super(ServiceDependency);
    }
}
