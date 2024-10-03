import type {PerpetualInventoryDeduction} from "@infrastructure/Database/Models/PerpetualInventoryDeduction";

import type {PerpetualInventoryDeductionEntity} from "./PerpetualInventoryDeductionEntity";

import type IBaseRepository from "@entities/IBaseRepository";

export interface IPerpetualInventoryDeductionRepository
    extends IBaseRepository<PerpetualInventoryDeduction, PerpetualInventoryDeductionEntity> {}
