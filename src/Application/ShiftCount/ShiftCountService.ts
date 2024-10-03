import {inject, injectable} from "tsyringe";

import {CartEntity} from "@entities/Cart/CartEntity";
import {ShiftCountEntity} from "@entities/ShiftCount/ShiftCountEntity";

import HttpResponse from "@appUtils/HttpResponse";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {ErrorLog} from "@logger/ErrorLog";

import type {GetCartsDto} from "./Dtos/GetCartsDto";
import type {GetShiftCountDto} from "./Dtos/GetShiftCountLogsDto";
import type {PaginationDto} from "@infraUtils/PaginationDto";
import type {PerpetualInventoryRepository} from "@repositories/PerpetualInventoryRepository";
import type {TFilterPerpetualInventory} from "@repositories/Shared/Query/PerpetualInventoryQueryBuilder";

@injectable()
export class ShiftCountService {
    constructor(
        @inject("IPerpetualInventoryRepository") private perpetualInventoryRepository: PerpetualInventoryRepository
    ) {}

    async getShiftCount(getShiftCountDto: GetShiftCountDto, paginationDto: PaginationDto) {
        try {
            const pagination = PaginationOptions.create(paginationDto);

            const perpetualInventory = await this.perpetualInventoryRepository.fetchPaginatedWithQueryBuilder(
                getShiftCountDto,
                pagination
            );

            if (!perpetualInventory) {
                return HttpResponse.notFound();
            }

            const shiftCountEntities = perpetualInventory.rows.map((pi) => ShiftCountEntity.create(pi));

            return HttpResponse.ok(
                PaginationData.getPaginatedData(pagination, perpetualInventory.count, shiftCountEntities)
            );
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getCarts(getCartsDto: GetCartsDto) {
        try {
            const carts = await this.perpetualInventoryRepository.fetchCarts(getCartsDto as TFilterPerpetualInventory);
            if (!carts) {
                return HttpResponse.notFound();
            }
            const cartEntities = carts.map(CartEntity.create);

            return HttpResponse.ok(cartEntities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
