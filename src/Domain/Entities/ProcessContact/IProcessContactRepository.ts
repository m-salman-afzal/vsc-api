import type IBaseRepository from "@entities/IBaseRepository";
import type {ProcessContactEntity} from "@entities/ProcessContact/ProcessContactEntity";
import type {ProcessContact} from "@infrastructure/Database/Models/ProcessContact";

export interface IProcessContactRepository extends IBaseRepository<ProcessContact, ProcessContactEntity> {}
