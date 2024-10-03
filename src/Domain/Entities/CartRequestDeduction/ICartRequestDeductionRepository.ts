import type {CartRequestDeductionEntity} from "@entities/CartRequestDeduction/CartRequestDeductionEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {CartRequestDeduction} from "@infrastructure/Database/Models/CartRequestDeduction";

export interface ICartRequestDeductionRepository
    extends IBaseRepository<CartRequestDeduction, CartRequestDeductionEntity> {}
