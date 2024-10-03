import {inject, injectable} from "tsyringe";

import {CartInventoryLogsEntity} from "@entities/CartInventoryLogs/CartInventoryLogsEntity";

import {BUCKETS, FCH_BUCKET_FOLDERS} from "@constants/CloudStorageConstant";
import {REPOSITORIES} from "@constants/FileConstant";

import {ORDER_BY, TIMEZONES} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {CartInventoryLogsFilter} from "@repositories/Shared/ORM/CartInventoryLogsFilter";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {
    cartInventoryLogsDrugService,
    cartService,
    cloudStorageUtils,
    perpetualInventoryService
} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {GetCartsDto} from "./Dtos/GetCartsDto";

import type {GetCartInventoryLogsDto} from "./Dtos/GetCartInventoryLogsDto";
import type {AddCartInventoryDto} from "@application/CartInventory/Dtos/AddCartInventoryDto";
import type {CartEntity} from "@entities/Cart/CartEntity";
import type {ICartInventoryLogsRepository} from "@entities/CartInventoryLogs/ICartInventoryLogsRepository";
import type {CartInventoryLogs} from "@infrastructure/Database/Models/CartInventoryLogs";
import type {PaginationDto} from "@infraUtils/PaginationDto";

@injectable()
export class CartInventoryLogsService extends BaseService<CartInventoryLogs, CartInventoryLogsEntity> {
    constructor(
        @inject("ICartInventoryLogsRepository") private cartInventoryLogsRepository: ICartInventoryLogsRepository
    ) {
        super(cartInventoryLogsRepository);
    }

    async addCartInventoryLogs(addCartInventoryDto: AddCartInventoryDto) {
        try {
            const {facilityId, cartId} = addCartInventoryDto;
            const perpetualInventoryItems = await perpetualInventoryService.fetchAll({facilityId, cartId}, {});

            if (!perpetualInventoryItems) {
                return HttpResponse.notFound();
            }

            const cart = (await cartService.fetch({cartId: cartId})) as CartEntity;
            const cartInventoryLogsEntity = CartInventoryLogsEntity.create(addCartInventoryDto);
            cartInventoryLogsEntity.cartInventoryLogsId = SharedUtils.shortUuid();
            cartInventoryLogsEntity.cart = cart.cart;

            cartInventoryLogsEntity.countedBySignature = addCartInventoryDto.countedBySignature
                ? `countedBySign-${cartInventoryLogsEntity.cartInventoryLogsId}.${SharedUtils.imageExtension(addCartInventoryDto.countedBySignature)}`
                : (null as never);
            cartInventoryLogsEntity.witnessSignature = addCartInventoryDto.witnessSignature
                ? `witSign-${cartInventoryLogsEntity.cartInventoryLogsId}.${SharedUtils.imageExtension(addCartInventoryDto.witnessSignature)}`
                : (null as never);

            addCartInventoryDto.countedBySignature &&
                (await cloudStorageUtils.uploadFile(
                    BUCKETS.FCH,
                    SharedUtils.base64Decoder(addCartInventoryDto.countedBySignature.split(";base64,")[1] as string),
                    `${FCH_BUCKET_FOLDERS.FACILITIES}/${addCartInventoryDto.facilityId}/${REPOSITORIES.CART_REQUEST_LOG}/${cartInventoryLogsEntity.countedBySignature}`
                ));

            addCartInventoryDto.witnessSignature &&
                (await cloudStorageUtils.uploadFile(
                    BUCKETS.FCH,
                    SharedUtils.base64Decoder(addCartInventoryDto.witnessSignature.split(";base64,")[1] as string),
                    `${FCH_BUCKET_FOLDERS.FACILITIES}/${addCartInventoryDto.facilityId}/${REPOSITORIES.CART_REQUEST_LOG}/${cartInventoryLogsEntity.witnessSignature}`
                ));

            await this.create(cartInventoryLogsEntity);

            await cartInventoryLogsDrugService.addCartInventoryLogs({
                facilityId,
                cartId,
                cartInventoryLogsId: cartInventoryLogsEntity.cartInventoryLogsId
            });

            return HttpResponse.created(cartInventoryLogsEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getCartInventoryLogs(getCartInventoryLogsDto: GetCartInventoryLogsDto, paginationDto: PaginationDto) {
        try {
            const searchFilters = CartInventoryLogsFilter.setFilter(getCartInventoryLogsDto);
            const pagination = PaginationOptions.create(paginationDto);
            const isLogs = await this.fetchPaginated(searchFilters, {id: ORDER_BY.DESC}, pagination);

            if (!isLogs) {
                return HttpResponse.notFound();
            }

            const cartRequestLogsCount = await this.count(searchFilters);

            const cartInventoryLogsEntiies = isLogs.map((log) => {
                const cartInventoryLogsEntity = CartInventoryLogsEntity.create(log);
                const {date, time} = SharedUtils.setDateTime(log.createdAt, TIMEZONES.AMERICA_NEWYORK);
                cartInventoryLogsEntity.createdAt = `${date} ${time}`;

                return cartInventoryLogsEntity;
            });

            const paginatedData = PaginationData.getPaginatedData(
                pagination,
                cartRequestLogsCount,
                cartInventoryLogsEntiies
            );

            return HttpResponse.ok(paginatedData);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getCarts(getCartsDto: GetCartsDto) {
        try {
            const {facilityId} = getCartsDto;

            const carts = await this.cartInventoryLogsRepository.fetchCarts({facilityId});

            if (!carts) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok(carts);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
