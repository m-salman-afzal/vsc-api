import {injectable} from "tsyringe";

import {CartInventoryEntity} from "@entities/CartInventory/CartInventoryEntity";

import {ORDER_BY} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {perpetualInventoryService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddCartInventoryDto} from "./Dtos/AddCartInventoryDto";
import type {GetCartInventoryDto} from "./Dtos/GetCartInventoryDto";
import type {PaginationDto} from "@infraUtils/PaginationDto";

@injectable()
export class CartInventoryService {
    async getInventory(getCartInventoryDto: GetCartInventoryDto, paginationDto: PaginationDto) {
        try {
            const pagination = PaginationOptions.create(paginationDto);

            const getCartInventory = await perpetualInventoryService.fetchPaginated(
                getCartInventoryDto,
                {rowNumber: ORDER_BY.ASC},
                pagination
            );

            if (!getCartInventory) {
                return HttpResponse.notFound();
            }

            const cartInventoryEntities = getCartInventory.map((cartInventory) => {
                const cartInventoryEntity = CartInventoryEntity.create(cartInventory);
                cartInventoryEntity.qtyOh = cartInventory.quantityAllocated;

                return cartInventoryEntity;
            });

            const cartInventoryCount = await perpetualInventoryService.count(getCartInventoryDto);

            return HttpResponse.ok(
                PaginationData.getPaginatedData(pagination, cartInventoryCount, cartInventoryEntities)
            );
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async addCartInventory(addCartInventoryDto: AddCartInventoryDto) {
        try {
            return HttpResponse.created(addCartInventoryDto);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
