import async from "async";
import {inject, injectable} from "tsyringe";

import {CartRequestDrugEntity} from "@entities/CartRequestDrug/CartRequestDrugEntity";
import {CartRequestFormEntity} from "@entities/CartRequestForm/CartRequestFormEntity";
import {FormularyEntity} from "@entities/Formulary/FormularyEntity";
import {ReferenceGuideDrugEntity} from "@entities/ReferenceGuideDrug/ReferenceGuideDrugEntity";

import {CART_ALLOCATION_STATUS, CART_PICK_STATUS, CART_REQUEST_TYPE} from "@constants/CartRequestConstant";

import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {
    cartRequestDrugService,
    cartRequestLogService,
    cartService,
    formularyService,
    inventoryService,
    referenceGuideDrugService
} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {GetCartRequestFormDto} from "./Dtos/GetCartRequestFormDto";
import type {TRequestForm, UpsertCartRequestFormDto} from "./Dtos/UpsertCartRequestFormDto";
import type {AdminEntity} from "@entities/Admin/AdminEntity";
import type {ICartRequestFormRepository} from "@entities/CartRequestForm/ICartRequestFormRepository";
import type {CartRequestDrug} from "@infrastructure/Database/Models/CartRequestDrug";
import type {CartRequestForm} from "@infrastructure/Database/Models/CartRequestForm";
import type {PaginationDto} from "@infraUtils/PaginationDto";

@injectable()
export class CartRequestFormService extends BaseService<CartRequestForm, CartRequestFormEntity> {
    constructor(@inject("ICartRequestFormRepository") cartRequestFormRepository: ICartRequestFormRepository) {
        super(cartRequestFormRepository);
    }

    async upsertCartRequestForm(upsertCartRequestFormDto: UpsertCartRequestFormDto, loggedInAdmin: AdminEntity) {
        try {
            const cartRequestLogEntity = await cartRequestLogService.addCartRequestLog({
                ...upsertCartRequestFormDto,
                adminId: loggedInAdmin.adminId,
                cartId: (upsertCartRequestFormDto.requestForm[0] as TRequestForm).cartId as string
            });

            await async.eachSeries(upsertCartRequestFormDto.requestForm, async (crf) => {
                try {
                    const isCart = await cartService.fetch({cartId: crf.cartId as string});
                    if (!isCart) {
                        return;
                    }

                    const isReferenceGuideDrug = await referenceGuideDrugService.fetch({
                        referenceGuideDrugId: crf.referenceGuideDrugId
                    });
                    if (!isReferenceGuideDrug) {
                        return;
                    }

                    const isFormulary = await formularyService.fetch({formularyId: crf.formularyId});
                    if (!isFormulary) {
                        return;
                    }

                    const cartRequestFormEntity = CartRequestFormEntity.create(crf);
                    cartRequestFormEntity.facilityId = upsertCartRequestFormDto.facilityId;
                    const isCartRequestForm = await this.fetch({
                        cartId: crf.cartId as string,
                        referenceGuideDrugId: crf.referenceGuideDrugId,
                        facilityId: upsertCartRequestFormDto.facilityId
                    });
                    if (!isCartRequestForm) {
                        cartRequestFormEntity.cartRequestFormId = SharedUtils.shortUuid();

                        await this.create(cartRequestFormEntity);
                    }

                    const cartRequestDrugEntity = CartRequestDrugEntity.create(crf);
                    cartRequestDrugEntity.cartRequestDrugId = SharedUtils.shortUuid();
                    cartRequestDrugEntity.cartRequestFormId = isCartRequestForm
                        ? isCartRequestForm.cartRequestFormId
                        : cartRequestFormEntity.cartRequestFormId;
                    cartRequestDrugEntity.facilityId = upsertCartRequestFormDto.facilityId;
                    cartRequestDrugEntity.cartRequestLogId = cartRequestLogEntity.cartRequestLogId;
                    cartRequestDrugEntity.pickStatus =
                        upsertCartRequestFormDto.type === CART_REQUEST_TYPE.AFTER_HOUR
                            ? CART_PICK_STATUS.PROCESSED
                            : CART_PICK_STATUS.UNPROCESSED;
                    cartRequestDrugEntity.allocationStatus =
                        upsertCartRequestFormDto.type === CART_REQUEST_TYPE.AFTER_HOUR
                            ? CART_ALLOCATION_STATUS.FULFILLED
                            : (null as never);
                    cartRequestDrugEntity.formularyId = crf.formularyId;
                    cartRequestDrugEntity.controlledId = upsertCartRequestFormDto.controlledId;
                    cartRequestDrugEntity.totalUnits = crf.packageQuantity * isFormulary.unitsPkg;
                    cartRequestDrugEntity.initialPendingOrderQuantity =
                        upsertCartRequestFormDto.type === CART_REQUEST_TYPE.STANDARD
                            ? crf.pendingOrderQuantity + crf.packageQuantity
                            : crf.pendingOrderQuantity;

                    if (upsertCartRequestFormDto.tr) {
                        cartRequestDrugEntity.tr = upsertCartRequestFormDto.tr;
                    }

                    await cartRequestDrugService.create(cartRequestDrugEntity);

                    if (upsertCartRequestFormDto.type === CART_REQUEST_TYPE.AFTER_HOUR) {
                        await inventoryService.cartRequestInventoryDeduction({
                            facilityId: upsertCartRequestFormDto.facilityId,
                            formularyId: crf.formularyId,
                            tobeDeductedQuantity: crf.packageQuantity * isFormulary.unitsPkg,
                            type: upsertCartRequestFormDto.type,
                            packageQuantity: crf.packageQuantity,
                            controlledId: upsertCartRequestFormDto.controlledId,
                            tr: cartRequestDrugEntity.tr as string,
                            cartRequestDrugId: cartRequestDrugEntity.cartRequestDrugId
                        });
                    }
                } catch (error) {
                    ErrorLog(error);
                }
            });

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getCartRequestForms(getCartRequestFormDto: GetCartRequestFormDto, paginationDto: PaginationDto) {
        try {
            const pagination = PaginationOptions.create(paginationDto);

            const referenceGuideDrugs = await referenceGuideDrugService.fetchPaginatedWithCart(
                {
                    ...getCartRequestFormDto
                },
                pagination
            );

            if (!referenceGuideDrugs) {
                return HttpResponse.notFound();
            }

            const cartRequestEntity = referenceGuideDrugs.rows.map((rgd) => {
                const cartRequestForm = rgd.cartRequestForm.find(
                    (crf) =>
                        crf.facilityId === getCartRequestFormDto.facilityId &&
                        crf.cartId === getCartRequestFormDto.cartId
                );

                const unfulfilledDrugs =
                    cartRequestForm &&
                    (cartRequestForm.cartRequestDrug.filter(
                        (crd) =>
                            crd.formularyId === rgd.formularyId &&
                            crd.allocationStatus !== CART_ALLOCATION_STATUS.FULFILLED
                    ) as unknown as CartRequestDrug[]);

                const pendingOrderQuantity =
                    unfulfilledDrugs && unfulfilledDrugs.length
                        ? Number(
                              (
                                  unfulfilledDrugs.reduce((acc, crd) => {
                                      return acc + crd.totalUnits;
                                  }, 0) / rgd.formulary.unitsPkg
                              ).toFixed(2)
                          )
                        : undefined;

                const activeInventory = rgd.formulary.inventory.filter((i) => i.isActive);

                const totalQuantity = inventoryService.totalQuantity(rgd.formulary, activeInventory);
                const isDepleted = totalQuantity > 0;

                return {
                    ...ReferenceGuideDrugEntity.create(rgd),
                    formulary: FormularyEntity.publicFields(rgd.formulary),
                    cartRequestForm: {
                        ...CartRequestFormEntity.create(cartRequestForm ?? {}),
                        pendingOrderQuantity: pendingOrderQuantity
                    },
                    containsActiveInventory: isDepleted
                };
            });

            const paginatedData = PaginationData.getPaginatedData(
                pagination,
                referenceGuideDrugs.count,
                cartRequestEntity
            );

            return HttpResponse.ok(paginatedData);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
