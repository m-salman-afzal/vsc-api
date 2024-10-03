import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {ShiftCountLogDrugs} from "@infrastructure/Database/Models/ShiftCountLogDrugs";

import type {IShiftCountLogDrugRepository} from "@entities/ShiftCountLogDrug/IShiftCountLogDrugRepository";
import type {ShiftCountLogDrugEntity} from "@entities/ShiftCountLogDrug/ShiftCountLogDrugEntity";

@injectable()
export class ShiftCountLogDrugRepository
    extends BaseRepository<ShiftCountLogDrugs, ShiftCountLogDrugEntity>
    implements IShiftCountLogDrugRepository
{
    constructor() {
        super(ShiftCountLogDrugs);
    }
}
