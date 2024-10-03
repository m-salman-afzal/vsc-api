import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {ControlledDrug} from "@infrastructure/Database/Models/ControlledDrug";

import type {ControlledDrugEntity} from "@entities/ControlledDrug/ControlledDrugEntity";
import type {IControlledDrugRepository} from "@entities/ControlledDrug/IControlledDrugRepository";

@injectable()
export class ControlledDrugRepository
    extends BaseRepository<ControlledDrug, ControlledDrugEntity>
    implements IControlledDrugRepository
{
    constructor() {
        super(ControlledDrug);
    }
}
