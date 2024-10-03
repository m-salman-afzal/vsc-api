import type IBaseRepository from "@entities/IBaseRepository";
import type {ProcessEntity} from "@entities/Process/ProcessEntity";
import type {Process} from "@infrastructure/Database/Models/Process";

export interface IProcessRepository extends IBaseRepository<Process, ProcessEntity> {}
