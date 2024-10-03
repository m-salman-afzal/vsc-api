import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {PerpetualInventoryDeduction} from "@infrastructure/Database/Models/PerpetualInventoryDeduction";

import type {IPerpetualInventoryDeductionRepository} from "@entities/PerpetualInventoryDeduction/IPerpetualInventoryDeductionRepository";
import type {PerpetualInventoryDeductionEntity} from "@entities/PerpetualInventoryDeduction/PerpetualInventoryDeductionEntity";

@injectable()
export class PerpetualInventoryDeductionRepository
    extends BaseRepository<PerpetualInventoryDeduction, PerpetualInventoryDeductionEntity>
    implements IPerpetualInventoryDeductionRepository
{
    constructor() {
        super(PerpetualInventoryDeduction);
    }
}
