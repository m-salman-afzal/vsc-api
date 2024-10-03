import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {CartRequestDeduction} from "@infrastructure/Database/Models/CartRequestDeduction";

import type {CartRequestDeductionEntity} from "@entities/CartRequestDeduction/CartRequestDeductionEntity";
import type {ICartRequestDeductionRepository} from "@entities/CartRequestDeduction/ICartRequestDeductionRepository";

@injectable()
export class CartRequestDeductionRepository
    extends BaseRepository<CartRequestDeduction, CartRequestDeductionEntity>
    implements ICartRequestDeductionRepository
{
    constructor() {
        super(CartRequestDeduction);
    }
}
