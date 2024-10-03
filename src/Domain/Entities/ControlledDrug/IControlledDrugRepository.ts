import type {ControlledDrugEntity} from "@entities/ControlledDrug/ControlledDrugEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {ControlledDrug} from "@infrastructure/Database/Models/ControlledDrug";

export interface IControlledDrugRepository extends IBaseRepository<ControlledDrug, ControlledDrugEntity> {}
