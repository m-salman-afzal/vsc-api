import type IBaseRepository from "@entities/IBaseRepository";
import type {PatientEntity} from "@entities/Patient/PatientEntity";
import type {Patient} from "@infrastructure/Database/Models/Patient";

export interface IPatientRepository extends IBaseRepository<Patient, PatientEntity> {}
