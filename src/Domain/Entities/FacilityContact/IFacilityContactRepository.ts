import type {FacilityContactEntity} from "@entities/FacilityContact/FacilityContactEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {FacilityContact} from "@infrastructure/Database/Models/FacilityContact";

export interface IFacilityContactRepository extends IBaseRepository<FacilityContact, FacilityContactEntity> {}
