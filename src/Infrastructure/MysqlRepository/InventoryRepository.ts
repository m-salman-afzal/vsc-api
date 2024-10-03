import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {Inventory} from "@infrastructure/Database/Models/Inventory";

import type {IInventoryRepository} from "@entities/Inventory/IInventoryRepository";
import type {InventoryEntity} from "@entities/Inventory/InventoryEntity";

@injectable()
export class InventoryRepository extends BaseRepository<Inventory, InventoryEntity> implements IInventoryRepository {
    constructor() {
        super(Inventory);
    }
}
