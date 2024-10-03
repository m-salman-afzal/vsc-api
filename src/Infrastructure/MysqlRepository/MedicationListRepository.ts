import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {MedicationList} from "@infrastructure/Database/Models/MedicationList";

import type {IMedicationListRepository} from "@entities/MedicationList/IMedicationListRepository";
import type {MedicationListEntity} from "@entities/MedicationList/MedicationListEntity";

@injectable()
export class MedicationListRepository
    extends BaseRepository<MedicationList, MedicationListEntity>
    implements IMedicationListRepository
{
    constructor() {
        super(MedicationList);
    }
}
