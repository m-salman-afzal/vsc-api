import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {InventoryHistory} from "@infrastructure/Database/Models/InventoryHistory";

import type {IInventoryHistoryRepository} from "@entities/InventoryHistory/IInventoryHistoryRepository";
import type {InventoryHistoryEntity} from "@entities/InventoryHistory/InventoryHistoryEntity";

@injectable()
export class InventoryHistoryRepository
    extends BaseRepository<InventoryHistory, InventoryHistoryEntity>
    implements IInventoryHistoryRepository
{
    constructor() {
        super(InventoryHistory);
    }
}
