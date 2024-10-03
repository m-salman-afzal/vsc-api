import type {ShiftCountLogDrugEntity} from "./ShiftCountLogDrugEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {ShiftCountLogDrugs} from "@infrastructure/Database/Models/ShiftCountLogDrugs";

export interface IShiftCountLogDrugRepository extends IBaseRepository<ShiftCountLogDrugs, ShiftCountLogDrugEntity> {}
