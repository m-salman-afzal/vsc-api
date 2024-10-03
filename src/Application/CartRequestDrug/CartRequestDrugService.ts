import async from "async";
import {inject, injectable} from "tsyringe";
import {In, IsNull, Not} from "typeorm";

import {AdminEntity} from "@entities/Admin/AdminEntity";
import {CartEntity} from "@entities/Cart/CartEntity";
import {CartRequestDeductionEntity} from "@entities/CartRequestDeduction/CartRequestDeductionEntity";
import {CartRequestDrugEntity} from "@entities/CartRequestDrug/CartRequestDrugEntity";
import {FormularyEntity} from "@entities/Formulary/FormularyEntity";

import {CART_ALLOCATION_STATUS, CART_PICK_STATUS, CART_REQUEST_TYPE} from "@constants/CartRequestConstant";
import {BUCKETS, FCH_BUCKET_FOLDERS} from "@constants/CloudStorageConstant";
import {REPOSITORIES} from "@constants/FileConstant";
import {CONTROLLED_TYPE} from "@constants/InventoryConstant";

import {ORDER_BY, TIMEZONES} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";
import {AddPerpetualInventoryDto} from "@application/PerpetualInventory/Dtos/AddPerpetualInventoryDto";

import {CartRequestDrugFilter} from "@repositories/Shared/ORM/CartRequestDrugFilter";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {
    adminService,
    cartRequestDeductionService,
    cartRequestLogService,
    cloudStorageUtils,
    controlledDrugService,
    formularyService,
    inventoryService,
    perpetualInventoryService
} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {GetCartAllocationDto} from "./Dtos/GetCartAllocationDto";
import type {GetCartPickDto} from "./Dtos/GetCartPickDto";
import type {GetCartRequestDrugDto} from "./Dtos/GetCartRequestDrugDto";
import type {RemoveCartRequestDrugDto} from "./Dtos/RemoveCartRequestDrugDto";
import type {UpdateCartAllocationDto} from "./Dtos/UpdateCartAllocationDto";
import type {UpdateCartPickDto} from "./Dtos/UpdateCartPickDto";
import type {ICartRequestDrugRepository} from "@entities/CartRequestDrug/ICartRequestDrugRepository";
import type {CartRequestDeduction} from "@infrastructure/Database/Models/CartRequestDeduction";
import type {CartRequestDrug} from "@infrastructure/Database/Models/CartRequestDrug";
import type {PaginationDto} from "@infraUtils/PaginationDto";
import type {TFilterCartRequestDrug} from "@repositories/Shared/Query/CartRequestDrugQueryBuilder";

@injectable()
export class CartRequestDrugService extends BaseService<CartRequestDrug, CartRequestDrugEntity> {
    constructor(@inject("ICartRequestDrugRepository") private cartRequestDrugRepository: ICartRequestDrugRepository) {
        super(cartRequestDrugRepository);
    }

    async fetchBySearchQuery(searchFilters: TFilterCartRequestDrug) {
        return await this.cartRequestDrugRepository.fetchBySearchQuery(searchFilters);
    }

    async fetchPaginatedBySearchQuery(searchFilters: TFilterCartRequestDrug, pagination: PaginationOptions) {
        return await this.cartRequestDrugRepository.fetchPaginatedBySearchQuery(searchFilters, pagination);
    }

    async fetchAllBySearchQuery(searchFilters: TFilterCartRequestDrug) {
        return await this.cartRequestDrugRepository.fetchAllBySearchQuery(searchFilters);
    }

    async fetchPaginatedForCartFulfilled(searchFilters: TFilterCartRequestDrug, pagination: PaginationOptions) {
        return await this.cartRequestDrugRepository.fetchPaginatedForCartFulfilled(searchFilters, pagination);
    }

    async fetchPaginatedForCartUnfulfilled(searchFilters: TFilterCartRequestDrug, pagination: PaginationOptions) {
        return await this.cartRequestDrugRepository.fetchPaginatedForCartUnfulfilled(searchFilters, pagination);
    }

    async fetchWithFormulary(searchFilters: TFilterCartRequestDrug) {
        return await this.cartRequestDrugRepository.fetchWithFormulary(searchFilters);
    }

    async getCartRequestDrugs(getCartRequestDrugDto: GetCartRequestDrugDto, paginationDto?: PaginationDto) {
        try {
            if (getCartRequestDrugDto.isRequestLog) {
                const cartRequestDrugs = await this.fetchBySearchQuery(getCartRequestDrugDto);
                if (!cartRequestDrugs) {
                    return HttpResponse.notFound();
                }

                const cartRequestDrugsEntity = cartRequestDrugs.map((crd) => {
                    const {date, time} = SharedUtils.setDateTime(crd.createdAt, TIMEZONES.AMERICA_NEWYORK);
                    const totalUnits = crd.formulary.unitsPkg ? crd.packageQuantity * crd.formulary.unitsPkg : 0;

                    return {
                        dateTime: `${date} ${time}`,
                        username: `${crd.cartRequestLog.admin.firstName} ${crd.cartRequestLog.admin.lastName}`,
                        cart: crd.cart.cart,
                        type: crd.cartRequestLog.type,
                        drug: SharedUtils.formularyName(crd.formulary),
                        drugClass: crd.formulary.drugClass,
                        package: crd.formulary.package,
                        min: crd.referenceGuideDrug.min,
                        max: crd.referenceGuideDrug.max,
                        packageQuantity: crd.packageQuantity,
                        isControlled: crd.formulary.isControlled,
                        totalUnits: totalUnits,
                        pendingOrderQuantity: crd.initialPendingOrderQuantity,
                        tr: crd.tr,
                        controlledId: crd.controlledId
                    };
                });

                return HttpResponse.ok(cartRequestDrugsEntity);
            }

            if (getCartRequestDrugDto.cartRequestLogType === CART_REQUEST_TYPE.INITIAL_ALLOCATION) {
                const cartRequestDrugs = await this.fetchAllBySearchQuery(getCartRequestDrugDto);
                if (!cartRequestDrugs) {
                    return HttpResponse.notFound();
                }

                const cartRequestDrugsEntity: unknown[] = [];
                for (const crd of cartRequestDrugs) {
                    const {date, time} = SharedUtils.setDateTime(crd.createdAt, TIMEZONES.AMERICA_NEWYORK);

                    cartRequestDrugsEntity.push({
                        dateTime: `${date} ${time}`,
                        username: `${crd.cartRequestLog.admin.lastName}, ${crd.cartRequestLog.admin.firstName}`,
                        cart: crd.cart && crd.cart.cart,
                        drug: SharedUtils.formularyName(crd.formulary),
                        drugClass: crd.formulary.drugClass,
                        package: crd.formulary.package,
                        min: crd.referenceGuideDrug && crd.referenceGuideDrug.min,
                        max: crd.referenceGuideDrug && crd.referenceGuideDrug.max,
                        packageQuantity: crd.packageQuantity,
                        isControlled: crd.formulary.isControlled,
                        totalUnits: crd.cartRequestDeduction.reduce((acc, crd) => crd.quantity + acc, 0),
                        tr: crd.tr,
                        controlledId: crd.controlledId,
                        unitsPkg: crd.formulary.unitsPkg
                    });
                }

                return HttpResponse.ok(cartRequestDrugsEntity);
            }

            const pagination = PaginationOptions.create(paginationDto);
            const cartRequestDrugs = await this.fetchPaginatedBySearchQuery(getCartRequestDrugDto, pagination);
            if (!cartRequestDrugs) {
                return HttpResponse.notFound();
            }

            const cartRequestDrugsEntity: unknown[] = [];
            for (const crd of cartRequestDrugs.rows) {
                const {date, time} = SharedUtils.setDateTime(crd.createdAt, TIMEZONES.AMERICA_NEWYORK);

                cartRequestDrugsEntity.push({
                    dateTime: `${date} ${time}`,
                    username: `${crd.cartRequestLog.admin.lastName}, ${crd.cartRequestLog.admin.firstName}`,
                    cart: crd.cart && crd.cart.cart,
                    drug: SharedUtils.formularyName(crd.formulary),
                    drugClass: crd.formulary.drugClass,
                    package: crd.formulary.package,
                    min: crd.referenceGuideDrug && crd.referenceGuideDrug.min,
                    max: crd.referenceGuideDrug && crd.referenceGuideDrug.max,
                    packageQuantity: crd.packageQuantity,
                    isControlled: crd.formulary.isControlled,
                    totalUnits: crd.formulary.isControlled
                        ? crd.totalUnits
                        : crd.packageQuantity * crd.formulary.unitsPkg,
                    receiverSignature:
                        getCartRequestDrugDto.cartRequestLogType !== CART_REQUEST_TYPE.PICK &&
                        getCartRequestDrugDto.cartRequestLogType !== CART_REQUEST_TYPE.DELETE &&
                        ((crd.cartRequestLog.type === CART_REQUEST_TYPE.AFTER_HOUR &&
                            crd.cartRequestLog.receiverSignature) ||
                            ((crd.cartRequestLog.type === CART_REQUEST_TYPE.ALLOCATION ||
                                crd.cartRequestLog.type === CART_REQUEST_TYPE.STANDARD) &&
                                crd.cartRequestAllocationLog.receiverSignature)) &&
                        (await cloudStorageUtils.generateV4ReadSignedUrl(
                            BUCKETS.FCH,
                            `${FCH_BUCKET_FOLDERS.FACILITIES}/${crd.facilityId}/${REPOSITORIES.CART_REQUEST_LOG}/${
                                crd.cartRequestLog.type === CART_REQUEST_TYPE.ALLOCATION ||
                                crd.cartRequestLog.type === CART_REQUEST_TYPE.STANDARD
                                    ? crd.cartRequestAllocationLog.receiverSignature
                                    : crd.cartRequestLog.receiverSignature
                            }`
                        )),
                    witnessSignature:
                        getCartRequestDrugDto.cartRequestLogType !== CART_REQUEST_TYPE.PICK &&
                        getCartRequestDrugDto.cartRequestLogType !== CART_REQUEST_TYPE.DELETE &&
                        ((crd.cartRequestLog.type === CART_REQUEST_TYPE.AFTER_HOUR &&
                            crd.cartRequestLog.witnessSignature) ||
                            ((crd.cartRequestLog.type === CART_REQUEST_TYPE.ALLOCATION ||
                                crd.cartRequestLog.type === CART_REQUEST_TYPE.STANDARD) &&
                                crd.cartRequestAllocationLog.witnessSignature)) &&
                        (await cloudStorageUtils.generateV4ReadSignedUrl(
                            BUCKETS.FCH,
                            `${FCH_BUCKET_FOLDERS.FACILITIES}/${crd.facilityId}/${REPOSITORIES.CART_REQUEST_LOG}/${
                                crd.cartRequestLog.type === CART_REQUEST_TYPE.ALLOCATION ||
                                crd.cartRequestLog.type === CART_REQUEST_TYPE.STANDARD
                                    ? crd.cartRequestAllocationLog.witnessSignature
                                    : crd.cartRequestLog.witnessSignature
                            }`
                        )),
                    tr: crd.tr,
                    controlledId: crd.controlledId,
                    unitsPkg: crd.formulary.unitsPkg
                });
            }

            const paginatedCartRequestDrugsEntity = PaginationData.getPaginatedData(
                pagination,
                cartRequestDrugs.count,
                cartRequestDrugsEntity
            );

            return HttpResponse.ok(paginatedCartRequestDrugsEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getCartPicks(getCartPickDto: GetCartPickDto, paginationDto: PaginationDto) {
        try {
            const pagination = PaginationOptions.create(paginationDto);

            const formularyWithLogDrugs = await formularyService.fetchPaginatedForCartPick(
                {
                    ...getCartPickDto,
                    cartFacilityId: getCartPickDto.facilityId,
                    controlledType: CONTROLLED_TYPE.STOCK
                },
                pagination
            );
            if (!formularyWithLogDrugs) {
                return HttpResponse.notFound();
            }

            const pickEntities = formularyWithLogDrugs.rows.map((fld: any) => {
                const processedAt = fld.allocatedAt && SharedUtils.setDateTime(fld.allocatedAt);
                const pickedAt = fld.pickedAt && SharedUtils.setDateTime(fld.pickedAt);

                return {
                    ...FormularyEntity.publicFields(fld),
                    formularyId: fld.formularyId,
                    packageQuantity: fld.totalPackageQuantities,
                    totalUnits: fld.totalUnits,
                    processedAt: processedAt ? `${processedAt.date} ${processedAt.time}` : "",
                    pickedAt: pickedAt ? `${pickedAt.date} ${pickedAt.time}` : "",
                    allocationStatus: fld.allocationStatus,
                    containsActive: true,
                    pickedByAdmin: fld.adminId ? AdminEntity.publicFields(fld) : {},
                    isDrugFound: fld.isDrugFound,
                    inventoryQuantity: Number(fld.sumNonControlledQuantity),
                    controlledQuantity: Number(fld.sumControlledQuantity)
                };
            });

            const paginatedPickEntity = PaginationData.getPaginatedData(
                pagination,
                formularyWithLogDrugs.count,
                pickEntities
            );

            return HttpResponse.ok(paginatedPickEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async updateCartPick(updateCartPickDto: UpdateCartPickDto, loggedInAdmin: AdminEntity) {
        try {
            const isCartRequestDrug = await this.fetchAll(
                {
                    formularyId: In(updateCartPickDto.formularyId),
                    pickStatus: updateCartPickDto.undo ? CART_PICK_STATUS.PROCESSED : CART_PICK_STATUS.UNPROCESSED,
                    allocationStatus: updateCartPickDto.undo ? CART_ALLOCATION_STATUS.UNFULFILLED : (undefined as never)
                },
                {}
            );
            if (!isCartRequestDrug) {
                return HttpResponse.notFound();
            }

            const cartRequestDrugIds = isCartRequestDrug.flatMap((data) => data.cartRequestDrugId);

            if (updateCartPickDto.undo) {
                await this.update({cartRequestDrugId: In(cartRequestDrugIds)}, {
                    pickStatus: CART_PICK_STATUS.UNPROCESSED,
                    allocationStatus: null,
                    pickedAt: null,
                    pickedByAdminId: null,
                    cartRequestPickLogId: null
                } as never);

                return HttpResponse.noContent();
            }

            await cartRequestLogService.update({type: CART_REQUEST_TYPE.PICK}, {canUndo: false} as never);

            const cartRequestLogEntity = await cartRequestLogService.addCartRequestLog({
                type: CART_REQUEST_TYPE.PICK,
                adminId: loggedInAdmin.adminId,
                facilityId: updateCartPickDto.facilityId,
                canUndo: true
            });

            await async.eachSeries(cartRequestDrugIds, async (crlId) => {
                try {
                    await this.update(
                        {cartRequestDrugId: crlId},
                        CartRequestDrugEntity.create({
                            pickStatus: updateCartPickDto.pickStatus,
                            pickedByAdminId: loggedInAdmin.adminId,
                            pickedAt: `${SharedUtils.getCurrentDate({})} ${SharedUtils.getCurrentTime({})}`,
                            allocationStatus: updateCartPickDto.allocationStatus,
                            cartRequestPickLogId: cartRequestLogEntity.cartRequestLogId
                        })
                    );
                } catch (error) {
                    ErrorLog(error);
                }
            });

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getCartAllocations(getCartAllocationDto: GetCartAllocationDto, paginationDto: PaginationDto) {
        try {
            const pagination = PaginationOptions.create(paginationDto);
            const searchFilters = {
                ...getCartAllocationDto,
                inventoryFacilityId: getCartAllocationDto.facilityId,
                controlledType: CONTROLLED_TYPE.STOCK
            };
            const cartAllocations =
                getCartAllocationDto.allocationStatus === CART_ALLOCATION_STATUS.FULFILLED
                    ? await this.fetchPaginatedForCartFulfilled(searchFilters, pagination)
                    : await this.fetchPaginatedForCartUnfulfilled(searchFilters, pagination);
            if (!cartAllocations) {
                return HttpResponse.notFound();
            }

            const cartAllocationEntity = cartAllocations.rows.map((ca) => {
                const totalUnits =
                    getCartAllocationDto.allocationStatus === CART_ALLOCATION_STATUS.UNFULFILLED
                        ? ca.totalUnits
                        : ca.cartRequestDeduction.reduce((acc, crd) => crd.quantity + acc, 0);

                const activeInventory = ca.formulary.inventory.filter((i) => i.isActive);
                const totalQuantity = inventoryService.totalQuantity(ca.formulary, activeInventory);

                const isDepleted = totalQuantity > 0;
                const commonFields = {
                    ...CartRequestDrugEntity.publicFields(ca),
                    formulary: FormularyEntity.publicFields(ca.formulary),
                    orderedByAdmin: ca.cartRequestLog.admin ? AdminEntity.publicFields(ca.cartRequestLog.admin) : {},
                    cart: ca.cart ? CartEntity.create(ca.cart) : {},
                    containsActive: isDepleted,
                    totalUnits: totalUnits,
                    packageQuantity: Number((totalUnits / ca.formulary.unitsPkg).toFixed(2))
                };

                return getCartAllocationDto.allocationStatus === CART_ALLOCATION_STATUS.FULFILLED
                    ? {
                          ...commonFields,
                          allocatedByAdmin: ca.allocatedByAdmin ? AdminEntity.publicFields(ca.allocatedByAdmin) : {},
                          allocatedAt: `${SharedUtils.setDateTime(ca.allocatedAt).date} ${SharedUtils.setDateTime(ca.allocatedAt).time}`
                      }
                    : commonFields;
            });

            const paginatedEntity = PaginationData.getPaginatedData(
                pagination,
                cartAllocations.count,
                cartAllocationEntity
            );

            return HttpResponse.ok(paginatedEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async updateCartAllocation(updateCartAllocationDto: UpdateCartAllocationDto, loggedInAdmin: AdminEntity) {
        try {
            if (updateCartAllocationDto.undo) {
                await this.update({cartRequestDrugId: In(updateCartAllocationDto.cartRequestDrugId)}, {
                    allocationStatus: CART_ALLOCATION_STATUS.UNFULFILLED,
                    allocatedAt: null,
                    allocatedByAdminId: null,
                    cartRequestAllocationLogId: null
                } as never);

                await async.eachSeries(updateCartAllocationDto.cartRequestDrugId, async (cartRequestDrugId) => {
                    await inventoryService.cartRequestRevertInventoryDeduction({cartRequestDrugId: cartRequestDrugId});
                });

                return HttpResponse.noContent();
            }

            await cartRequestLogService.update(
                {
                    type: CART_REQUEST_TYPE.ALLOCATION,
                    controlledType: updateCartAllocationDto.controlledId ? Not(IsNull()) : IsNull()
                },
                {
                    canUndo: false
                } as never
            );

            const cartRequestLogEntity = await cartRequestLogService.addCartRequestLog({
                ...updateCartAllocationDto,
                controlledType: updateCartAllocationDto.controlledId ? CONTROLLED_TYPE.STOCK : (undefined as never),
                adminId: loggedInAdmin.adminId,
                canUndo: true
            });

            const cartRequestDeductionDeleteFilters = updateCartAllocationDto.controlledId
                ? {
                      controlledDrugId: Not(IsNull())
                  }
                : {
                      inventoryId: Not(IsNull())
                  };
            await cartRequestDeductionService.update(
                cartRequestDeductionDeleteFilters,
                {deletedAt: `${SharedUtils.getCurrentDate({})} ${SharedUtils.getCurrentTime({})}`} as never,
                true
            );

            await async.eachSeries(updateCartAllocationDto.cartRequestDrugId, async (crlId) => {
                try {
                    const isCartRequestDrug = await this.fetchWithFormulary({cartRequestDrugId: crlId});
                    if (!isCartRequestDrug) {
                        return;
                    }

                    const updateAllocationEntity = {
                        allocatedByAdminId: loggedInAdmin.adminId,
                        allocatedAt: `${SharedUtils.getCurrentDate({})} ${SharedUtils.getCurrentTime({})}`,
                        allocationStatus: updateCartAllocationDto.allocationStatus,
                        cartRequestAllocationLogId: cartRequestLogEntity.cartRequestLogId,
                        controlledId: updateCartAllocationDto.controlledId,
                        tr: updateCartAllocationDto.tr
                    };

                    let newCartRequestDrugId = "";
                    if (isCartRequestDrug.allocationStatus === CART_ALLOCATION_STATUS.PARTIAL) {
                        const cartRequestDrugEntity = CartRequestDrugEntity.create(isCartRequestDrug);
                        cartRequestDrugEntity.cartRequestDrugId = SharedUtils.shortUuid();
                        cartRequestDrugEntity.pickStatus = CART_PICK_STATUS.PROCESSED;
                        cartRequestDrugEntity.allocationStatus = CART_ALLOCATION_STATUS.FULFILLED;
                        cartRequestDrugEntity.cartRequestLogId = cartRequestLogEntity.cartRequestLogId;
                        cartRequestDrugEntity.cartRequestAllocationLogId = cartRequestLogEntity.cartRequestLogId;
                        cartRequestDrugEntity.allocatedAt = `${SharedUtils.getCurrentDate({})} ${SharedUtils.getCurrentTime({})}`;
                        cartRequestDrugEntity.allocatedByAdminId = loggedInAdmin.adminId;
                        newCartRequestDrugId = cartRequestDrugEntity.cartRequestDrugId;
                        cartRequestDrugEntity.totalUnits = 0;
                        cartRequestDrugEntity.fromPartial = true;

                        await this.create(cartRequestDrugEntity);
                    } else {
                        await this.update(
                            {cartRequestDrugId: crlId},
                            CartRequestDrugEntity.create(updateAllocationEntity)
                        );
                    }

                    await inventoryService.cartRequestInventoryDeduction({
                        facilityId: updateCartAllocationDto.facilityId,
                        formularyId: isCartRequestDrug.formularyId,
                        tobeDeductedQuantity: isCartRequestDrug.totalUnits,
                        type: updateCartAllocationDto.type,
                        cartRequestDrugId: crlId,
                        referenceGuideDrugId: isCartRequestDrug.referenceGuideDrugId,
                        packageQuantity: isCartRequestDrug.packageQuantity,
                        controlledId: updateCartAllocationDto.controlledId,
                        tr: updateCartAllocationDto.tr as string
                    });

                    if (isCartRequestDrug.allocationStatus === CART_ALLOCATION_STATUS.PARTIAL) {
                        const lastCartRequestDeduction = await cartRequestDeductionService.fetchPaginated(
                            {},
                            {id: ORDER_BY.DESC},
                            {currentPage: 1, perPage: 1, offset: 0}
                        );
                        if (!lastCartRequestDeduction) {
                            return;
                        }

                        await cartRequestDeductionService.update(
                            {cartRequestDeductionId: lastCartRequestDeduction[0]?.cartRequestDeductionId as string},
                            {
                                deletedAt: `${SharedUtils.getCurrentDate({})} ${SharedUtils.getCurrentTime({})}`,
                                cartRequestDrugId: null as never,
                                controlledDrugId: null as never
                            } as never,
                            true
                        );

                        const cartRequestDeductionEntity = CartRequestDeductionEntity.create({
                            cartRequestDeductionId: SharedUtils.shortUuid(),
                            quantity: (lastCartRequestDeduction[0] as CartRequestDeduction).quantity,
                            controlledDrugId: (lastCartRequestDeduction[0] as CartRequestDeduction).controlledDrugId,
                            facilityId: isCartRequestDrug.facilityId,
                            cartRequestDrugId: newCartRequestDrugId
                        });
                        await cartRequestDeductionService.create(cartRequestDeductionEntity);

                        if (isCartRequestDrug.controlledId) {
                            const formulary = await formularyService.fetch({
                                formularyId: isCartRequestDrug.formularyId
                            });
                            const controlledDrug = await controlledDrugService.fetch({
                                controlledDrugId: cartRequestDeductionEntity.controlledDrugId
                            });
                            await perpetualInventoryService.addPerpetualInventory(
                                AddPerpetualInventoryDto.create({
                                    controlledId: isCartRequestDrug.controlledId,
                                    facilityId: isCartRequestDrug.facilityId,
                                    quantityAllocated: cartRequestDeductionEntity.quantity,
                                    cartRequestDeductionId: cartRequestDeductionEntity.cartRequestDeductionId,
                                    tr: controlledDrug ? controlledDrug.tr : undefined,
                                    name: formulary ? formulary.name : undefined,
                                    controlledDrugId: cartRequestDeductionEntity.controlledDrugId,
                                    cartId: isCartRequestDrug.cartId,
                                    isPatientSpecific: false
                                })
                            );
                        }
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

    async getCartRequestAdmins() {
        try {
            const fulfilledByAdmins = await adminService.fetchAllCartRequestAllocatedBy();
            const orderedByAdmins = await adminService.fetchAllCartRequestOrderedBy();
            if (!fulfilledByAdmins && !orderedByAdmins) {
                return HttpResponse.notFound();
            }

            const adminEntity = {
                fulfilledByAdmins: fulfilledByAdmins ? fulfilledByAdmins.map((fa) => AdminEntity.publicFields(fa)) : [],
                orderedByAdmins: orderedByAdmins ? orderedByAdmins.map((oa) => AdminEntity.publicFields(oa)) : []
            };

            return HttpResponse.ok(adminEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async removeCartRequestDrug(removeCartRequestDrugDto: RemoveCartRequestDrugDto, loggedInAdmin: AdminEntity) {
        try {
            const searchFilters = CartRequestDrugFilter.setFilter(removeCartRequestDrugDto);
            const cartRequestDrugs = await this.fetchAll(searchFilters, {});
            if (!cartRequestDrugs) {
                return HttpResponse.notFound();
            }

            const cartRequestLogEntity = await cartRequestLogService.addCartRequestLog({
                type: CART_REQUEST_TYPE.DELETE,
                adminId: loggedInAdmin.adminId,
                facilityId: removeCartRequestDrugDto.facilityId
            });

            await this.update(searchFilters, {
                cartRequestDeletionLogId: cartRequestLogEntity.cartRequestLogId
            } as never);

            await this.update(
                searchFilters,
                {deletedAt: `${SharedUtils.getCurrentDate({})} ${SharedUtils.getCurrentTime({})}`} as never,
                true
            );

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
