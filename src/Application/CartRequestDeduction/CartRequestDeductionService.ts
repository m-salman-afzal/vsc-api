import {inject, injectable} from "tsyringe";

import {BaseService} from "@application/BaseService";

import type {CartRequestDeductionEntity} from "@entities/CartRequestDeduction/CartRequestDeductionEntity";
import type {ICartRequestDeductionRepository} from "@entities/CartRequestDeduction/ICartRequestDeductionRepository";
import type {CartRequestDeduction} from "@infrastructure/Database/Models/CartRequestDeduction";

@injectable()
export class CartRequestDeductionService extends BaseService<CartRequestDeduction, CartRequestDeductionEntity> {
    constructor(
        @inject("ICartRequestDeductionRepository") cartRequestDeductionRepository: ICartRequestDeductionRepository
    ) {
        super(cartRequestDeductionRepository);
    }
}
