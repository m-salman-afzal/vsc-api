import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {CartInventoryLogsDrug} from "@infrastructure/Database/Models/CartInventoryLogsDrug";

import type {CartInventoryLogsDrugEntity} from "@entities/CartInventoryLogsDrug/CartInventoryLogsDrugEntity";
import type {ICartInventoryLogsDrugRepository} from "@entities/CartInventoryLogsDrug/ICartInventoryLogsDrugRepository";

@injectable()
export class CartInventoryLogsDrugRepository
    extends BaseRepository<CartInventoryLogsDrug, CartInventoryLogsDrugEntity>
    implements ICartInventoryLogsDrugRepository
{
    constructor() {
        super(CartInventoryLogsDrug);
    }
}
