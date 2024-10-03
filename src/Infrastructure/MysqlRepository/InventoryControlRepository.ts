import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {InventoryControl} from "@infrastructure/Database/Models/InventoryControl";

import type {IInventoryControlRepository} from "@entities/InventoryControl/IInventoryControlRepository";
import type {InventoryControlEntity} from "@entities/InventoryControl/InventoryControlEntity";

@injectable()
export class InventoryControlRepository
    extends BaseRepository<InventoryControl, InventoryControlEntity>
    implements IInventoryControlRepository
{
    constructor() {
        super(InventoryControl);
    }
}
