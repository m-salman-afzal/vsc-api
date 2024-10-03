import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {Patient} from "@infrastructure/Database/Models/Patient";

import type {IPatientRepository} from "@entities/Patient/IPatientRepository";
import type {PatientEntity} from "@entities/Patient/PatientEntity";

@injectable()
export class PatientRepository extends BaseRepository<Patient, PatientEntity> implements IPatientRepository {
    constructor() {
        super(Patient);
    }
}
