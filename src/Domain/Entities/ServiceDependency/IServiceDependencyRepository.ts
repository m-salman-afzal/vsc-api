import type {ServiceDependencyEntity} from "./ServiceDependencyEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {ServiceDependency} from "@infrastructure/Database/Models/ServiceDependency";

export interface IServiceDependencyRepository extends IBaseRepository<ServiceDependency, ServiceDependencyEntity> {}
