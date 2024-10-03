import type {FormularyLevelEntity} from "@entities/FormularyLevel/FormularyLevelEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {FormularyLevel} from "@infrastructure/Database/Models/FormularyLevel";

export interface IFormularyLevelRepository extends IBaseRepository<FormularyLevel, FormularyLevelEntity> {}
