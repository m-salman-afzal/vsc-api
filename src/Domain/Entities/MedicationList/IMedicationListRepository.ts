import type IBaseRepository from "@entities/IBaseRepository";
import type {MedicationListEntity} from "@entities/MedicationList/MedicationListEntity";
import type {MedicationList} from "@infrastructure/Database/Models/MedicationList";

export interface IMedicationListRepository extends IBaseRepository<MedicationList, MedicationListEntity> {}
