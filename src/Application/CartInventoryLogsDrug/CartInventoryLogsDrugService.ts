import {inject, injectable} from "tsyringe";

import {CartInventoryLogsDrugEntity} from "@entities/CartInventoryLogsDrug/CartInventoryLogsDrugEntity";
import type {ICartInventoryLogsDrugRepository} from "@entities/CartInventoryLogsDrug/ICartInventoryLogsDrugRepository";

import {ORDER_BY} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import PaginationData from "@infraUtils/PaginationData";
import type {PaginationDto} from "@infraUtils/PaginationDto";
import PaginationOptions from "@infraUtils/PaginationOptions";

import type {CartInventoryLogsDrug} from "@infrastructure/Database/Models/CartInventoryLogsDrug";
import {perpetualInventoryService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddCartInventoryLogsDrugDto} from "./Dtos/AddCartInventoryLogsDrugDto";
import type {GetCartInventoryLogsDrugDto} from "./Dtos/GetCartInventoryLogsDrugDto";

@injectable()
export class CartInventoryLogsDrugService extends BaseService<CartInventoryLogsDrug, CartInventoryLogsDrugEntity> {
    constructor(
        @inject("ICartInventoryLogsDrugRepository") cartInventoryLogsDrugRepository: ICartInventoryLogsDrugRepository
    ) {
        super(cartInventoryLogsDrugRepository);
    }

    async addCartInventoryLogs(addCartInventoryLogsDto: AddCartInventoryLogsDrugDto) {
        try {
            const {facilityId, cartId, cartInventoryLogsId} = addCartInventoryLogsDto;
            const perpetualInventoryItems = await perpetualInventoryService.fetchAll({facilityId, cartId}, {});

            if (!perpetualInventoryItems) {
                return HttpResponse.notFound();
            }

            const logsEntities = perpetualInventoryItems.map((prep) => {
                const logsEntity = CartInventoryLogsDrugEntity.create(prep);
                logsEntity.cartInventoryLogsDrugId = SharedUtils.shortUuid();
                logsEntity.cartInventoryLogsId = cartInventoryLogsId;

                return logsEntity;
            });

            await this.bulkInsert(logsEntities);

            return HttpResponse.ok({});
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getCartInventoryLogs(getCartInventoryLogsDrugDto: GetCartInventoryLogsDrugDto, paginationDto: PaginationDto) {
        try {
            const {cartInventoryLogsId} = getCartInventoryLogsDrugDto;
            const pagination = PaginationOptions.create(paginationDto);
            const drugLogs = await this.fetchPaginated({cartInventoryLogsId}, {id: ORDER_BY.DESC}, pagination);

            if (!drugLogs) {
                return HttpResponse.notFound();
            }

            const cartRequestLogsCount = await this.count({cartInventoryLogsId});

            const cartInventoryLogsDrugEntiies = drugLogs.map((log) => {
                const cartInventoryLogsDrugEntity = CartInventoryLogsDrugEntity.create(log);
                cartInventoryLogsDrugEntity.quantity = log.quantity;
                
return cartInventoryLogsDrugEntity;
            });

            const paginatedData = PaginationData.getPaginatedData(
                pagination,
                cartRequestLogsCount,
                cartInventoryLogsDrugEntiies
            );

            return HttpResponse.ok(paginatedData);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
