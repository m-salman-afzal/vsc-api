import type IBaseRepository from "@entities/IBaseRepository";
import type {ServiceListEntity} from "@entities/ServiceList/ServiceListEntity";
import type {ServiceList} from "@infrastructure/Database/Models/ServiceList";

export interface IServiceListRepository extends IBaseRepository<ServiceList, ServiceListEntity> {}
