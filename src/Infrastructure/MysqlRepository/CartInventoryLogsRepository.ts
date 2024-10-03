import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {CartInventoryLogs} from "@infrastructure/Database/Models/CartInventoryLogs";

import type { TFilterCartInventoryLogs} from "./Shared/Query/CartInventoryLogQueryBuilder";
import {CartInventoryLogsQueryBuilder} from "./Shared/Query/CartInventoryLogQueryBuilder";

import type {CartInventoryLogsEntity} from "@entities/CartInventoryLogs/CartInventoryLogsEntity";
import type {ICartInventoryLogsRepository} from "@entities/CartInventoryLogs/ICartInventoryLogsRepository";

@injectable()
export class CartInventoryLogsRepository
    extends BaseRepository<CartInventoryLogs, CartInventoryLogsEntity>
    implements ICartInventoryLogsRepository
{
    constructor() {
        super(CartInventoryLogs);
    }

    async fetchCarts(searchFilter: TFilterCartInventoryLogs) {
        const query = this.model
            .createQueryBuilder("cartInventoryLogs")
            .select("DISTINCT cartInventoryLogs.cart", "cart");

        const queryFilters = CartInventoryLogsQueryBuilder.setFilter(query, searchFilter);
        const response = await queryFilters.getRawMany();

        if (!response.length) {
            return false;
        }

        return response;
    }
}
