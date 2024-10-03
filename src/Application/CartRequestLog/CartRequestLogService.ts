import {inject, injectable} from "tsyringe";

import {AdminEntity} from "@entities/Admin/AdminEntity";
import {CartEntity} from "@entities/Cart/CartEntity";
import {CartRequestLogEntity} from "@entities/CartRequestLog/CartRequestLogEntity";

import {CART_REQUEST_TYPE} from "@constants/CartRequestConstant";
import {BUCKETS, FCH_BUCKET_FOLDERS} from "@constants/CloudStorageConstant";
import {REPOSITORIES} from "@constants/FileConstant";

import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {cloudStorageUtils} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddCartRequestLogDto} from "./Dtos/AddCartRequestLogDto";
import type {GetCartRequestLogDto} from "./Dtos/GetCartRequestLogDto";
import type {ICartRequestLogRepository} from "@entities/CartRequestLog/ICartRequestLogRepository";
import type {CartRequestDeduction} from "@infrastructure/Database/Models/CartRequestDeduction";
import type {CartRequestLog} from "@infrastructure/Database/Models/CartRequestLog";
import type {PaginationDto} from "@infraUtils/PaginationDto";
import type {TFilterCartRequestLog} from "@repositories/Shared/Query/CartRequestLogQueryBuilder";

@injectable()
export class CartRequestLogService extends BaseService<CartRequestLog, CartRequestLogEntity> {
    constructor(@inject("ICartRequestLogRepository") private cartRequestLogRepository: ICartRequestLogRepository) {
        super(cartRequestLogRepository);
    }

    async fetchPaginatedBySearchQuery(searchFilters: TFilterCartRequestLog, pagination: PaginationOptions) {
        return await this.cartRequestLogRepository.fetchPaginatedBySearchQuery(searchFilters, pagination);
    }

    async fetchPaginatedForCartFulfilled(searchFilters: TFilterCartRequestLog, pagination: PaginationOptions) {
        return await this.cartRequestLogRepository.fetchPaginatedForCartFulfilled(searchFilters, pagination);
    }

    async addCartRequestLog(addCartRequestLogDto: AddCartRequestLogDto) {
        const cartRequestLogEntity = CartRequestLogEntity.create(addCartRequestLogDto);
        cartRequestLogEntity.cartRequestLogId = SharedUtils.shortUuid();
        if (!addCartRequestLogDto.controlledType) {
            await this.create(cartRequestLogEntity);

            return cartRequestLogEntity;
        }

        cartRequestLogEntity.receiverSignature = addCartRequestLogDto.signatureImages
            ? `recSign-${cartRequestLogEntity.cartRequestLogId}.${SharedUtils.imageExtension(addCartRequestLogDto.signatureImages.receiverSignatureImage)}`
            : (null as never);
        cartRequestLogEntity.witnessSignature = addCartRequestLogDto.signatureImages
            ? `witSign-${cartRequestLogEntity.cartRequestLogId}.${SharedUtils.imageExtension(addCartRequestLogDto.signatureImages.witnessSignatureImage)}`
            : (null as never);

        addCartRequestLogDto.signatureImages &&
            (await cloudStorageUtils.uploadFile(
                BUCKETS.FCH,
                SharedUtils.base64Decoder(
                    addCartRequestLogDto.signatureImages.receiverSignatureImage.split(";base64,")[1] as string
                ),
                `${FCH_BUCKET_FOLDERS.FACILITIES}/${addCartRequestLogDto.facilityId}/${REPOSITORIES.CART_REQUEST_LOG}/${cartRequestLogEntity.receiverSignature}`
            ));

        addCartRequestLogDto.signatureImages &&
            (await cloudStorageUtils.uploadFile(
                BUCKETS.FCH,
                SharedUtils.base64Decoder(
                    addCartRequestLogDto.signatureImages.witnessSignatureImage.split(";base64,")[1] as string
                ),
                `${FCH_BUCKET_FOLDERS.FACILITIES}/${addCartRequestLogDto.facilityId}/${REPOSITORIES.CART_REQUEST_LOG}/${cartRequestLogEntity.witnessSignature}`
            ));

        await this.create(cartRequestLogEntity);

        return cartRequestLogEntity;
    }

    private choosenRequestLogType(crl: CartRequestLog) {
        switch (crl.type) {
            case CART_REQUEST_TYPE.PICK:
                return "cartRequestPickDrug";

            case CART_REQUEST_TYPE.ALLOCATION:
                return "cartRequestAllocationDrug";

            case CART_REQUEST_TYPE.DELETE:
                return "cartRequestDeletionDrug";

            case CART_REQUEST_TYPE.AFTER_HOUR:
                return "cartRequestDrug";

            default:
                return `cartRequestDrug`;
        }
    }

    async getCartRequestLogs(getCartRequestLogDto: GetCartRequestLogDto, paginationDto: PaginationDto) {
        try {
            const pagination = PaginationOptions.create(paginationDto);

            const cartRequestLogs = await this.fetchPaginatedBySearchQuery(
                {...getCartRequestLogDto, forRequestLog: true},
                pagination
            );
            if (!cartRequestLogs) {
                return HttpResponse.notFound();
            }

            const cartRequestLogEntity: unknown[] = [];
            for (const crl of cartRequestLogs.rows) {
                const stats: {drugCount: number; totalUnit: number} = {drugCount: 0, totalUnit: 0};

                const drugCount = crl[`${this.choosenRequestLogType(crl)}`].filter((crlt) => !crlt.fromPartial).length;
                stats.drugCount = drugCount === 0 ? 1 : drugCount;

                stats.totalUnit = crl[`${this.choosenRequestLogType(crl)}`].reduce((initialValue, currentValue) => {
                    if (crl.controlledType || crl.type === CART_REQUEST_TYPE.INITIAL_ALLOCATION) {
                        const filteredCartRequestDeduction = SharedUtils.getUniqueObjects(
                            currentValue.cartRequestDeduction,
                            ["controlledDrugId", "cartRequestDrugId"]
                        );

                        return (
                            initialValue +
                            filteredCartRequestDeduction.reduce(
                                (acc, qnt) => acc + (qnt as CartRequestDeduction).quantity,
                                0
                            )
                        );
                    }

                    if (!currentValue.fromPartial) {
                        return initialValue + currentValue.packageQuantity * currentValue.formulary.unitsPkg;
                    }

                    return initialValue;
                }, 0);

                cartRequestLogEntity.push({
                    ...CartRequestLogEntity.publicFields(crl),
                    ...stats,
                    admin: AdminEntity.publicFields(crl.admin),
                    cart: crl.cart && CartEntity.create(crl.cart),
                    isControlled: crl[`${this.choosenRequestLogType(crl)}`].some((drug) => drug.formulary.isControlled)
                });
            }

            const paginatedData = PaginationData.getPaginatedData(
                pagination,
                cartRequestLogs.count,
                cartRequestLogEntity
            );

            return HttpResponse.ok(paginatedData);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    setStatForControlled(crl: CartRequestLog) {
        const stats: {drugCount: number; totalUnit: number} = {
            drugCount: 0,
            totalUnit: 0
        };
        if (crl.type !== CART_REQUEST_TYPE.ALLOCATION) {
            stats.drugCount = crl[`${this.choosenRequestLogType(crl)}`].filter((crlt) => !crlt.fromPartial).length;
            stats.totalUnit = crl[`${this.choosenRequestLogType(crl)}`]
                .filter((crlt) => !crlt.fromPartial)
                .reduce(
                    (initialValue, currentValue) =>
                        initialValue + currentValue.packageQuantity * currentValue.formulary.unitsPkg,
                    0
                );
        } else if (crl.type === CART_REQUEST_TYPE.ALLOCATION) {
            stats.drugCount = crl[`${this.choosenRequestLogType(crl)}`].filter((crlt) => !crlt.fromPartial).length;
            stats.totalUnit = crl[`${this.choosenRequestLogType(crl)}`].reduce(
                (initialValue, currentValue) =>
                    initialValue + currentValue.cartRequestDeduction.reduce((acc, qnt) => acc + qnt.quantity, 0),
                0
            );
        }

        return stats;
    }
}
