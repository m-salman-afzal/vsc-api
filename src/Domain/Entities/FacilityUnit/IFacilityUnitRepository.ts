import type {FacilityUnitEntity} from "@entities/FacilityUnit/FacilityUnitEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {FacilityUnit} from "@infrastructure/Database/Models/FacilityUnit";

export interface IFacilityUnitRepository extends IBaseRepository<FacilityUnit, FacilityUnitEntity> {}
