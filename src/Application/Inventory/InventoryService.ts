import async from "async";
import {inject, injectable} from "tsyringe";
import {IsNull} from "typeorm";

import {CartRequestDeductionEntity} from "@entities/CartRequestDeduction/CartRequestDeductionEntity";
import {ControlledDrugEntity} from "@entities/ControlledDrug/ControlledDrugEntity";
import {FormularyEntity} from "@entities/Formulary/FormularyEntity";
import {FormularyLevelEntity} from "@entities/FormularyLevel/FormularyLevelEntity";
import {InventoryEntity} from "@entities/Inventory/InventoryEntity";

import {CART_ALLOCATION_STATUS, CART_REQUEST_TYPE} from "@constants/CartRequestConstant";
import {REPOSITORIES} from "@constants/FileConstant";
import {DRUG_CLASSES} from "@constants/FormularyConstant";
import {CONTROLLED_TYPE, INVENTORY_NOTIFICATION_TYPES} from "@constants/InventoryConstant";

import {ORDER_BY} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";
import {AddFormularyLevelDto} from "@application/FormularyLevel/Dtos/UpsertFormularyLevelDto";
import {AddNotificationDto} from "@application/Notification/DTOs/AddNotificationDTO";
import {AddNotificationAdminDto} from "@application/NotificationAdmins/DTOs/AddNotificationAdminDTO";
import {AddPerpetualInventoryDto} from "@application/PerpetualInventory/Dtos/AddPerpetualInventoryDto";
import {RevertPerpetualInventoryDto} from "@application/PerpetualInventory/Dtos/RevertPerpetualInventoryDto";

import {ControlledDrugFilter} from "@repositories/Shared/ORM/ControlledDrugFilter";
import {InventoryFilter} from "@repositories/Shared/ORM/InventoryFilter";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {
    adminService,
    cartRequestDeductionService,
    cartRequestDrugService,
    controlledDrugService,
    formularyLevelService,
    formularyService,
    inventoryControlService,
    notificationAdminService,
    notificationService,
    perpetualInventoryService
} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddInventoryDto} from "./Dtos/AddInventoryDto";
import type {GetAllInventoryDto} from "./Dtos/GetAllInventoryDto";
import type {GetControlledIdDto} from "./Dtos/GetControlledIdDto";
import type {GetInventoryDto} from "./Dtos/GetInventoryDto";
import type {GetInventorySuggestionDto} from "./Dtos/GetInventorySuggestionDto";
import type {RemoveInventoryDto} from "./Dtos/RemoveInventoryDto";
import type {UpdateInventoryDto} from "./Dtos/UpdateInventoryDto";
import type {IInventoryRepository} from "@entities/Inventory/IInventoryRepository";
import type {Formulary} from "@infrastructure/Database/Models/Formulary";
import type {Inventory} from "@infrastructure/Database/Models/Inventory";
import type {PaginationDto} from "@infraUtils/PaginationDto";

@injectable()
export class InventoryService extends BaseService<Inventory, InventoryEntity> {
    constructor(@inject("IInventoryRepository") inventoryRepository: IInventoryRepository) {
        super(inventoryRepository);
    }

    async addInventory(addInventoryDto: AddInventoryDto) {
        try {
            const searchFilters = InventoryFilter.setFilter({
                formularyId: addInventoryDto.formularyId,
                ndc: addInventoryDto.ndc,
                lotNo: addInventoryDto.lotNo,
                facilityId: addInventoryDto.facilityId
            });
            const isInventory = await this.fetch(searchFilters);

            const formulary = await formularyService.fetch({formularyId: addInventoryDto.formularyId});
            if ((formulary && formulary.isControlled && !addInventoryDto.controlledId) || !formulary) {
                return HttpResponse.notFound();
            }

            if (addInventoryDto.min && addInventoryDto.max && addInventoryDto.threshold && addInventoryDto.parLevel) {
                const addFormularyLevelDto = AddFormularyLevelDto.create(addInventoryDto);
                await formularyLevelService.subUpsertFormularyLevel(addFormularyLevelDto);
            }

            const inventoryEntity = InventoryEntity.create(addInventoryDto);
            inventoryEntity.inventoryId = isInventory ? isInventory.inventoryId : SharedUtils.shortUuid();
            inventoryEntity.isActive = formulary && formulary.isActive;

            if (!formulary.isControlled) {
                inventoryEntity.quantity = isInventory
                    ? isInventory.quantity + addInventoryDto.quantity
                    : addInventoryDto.quantity;

                await this.upsert({inventoryId: inventoryEntity.inventoryId}, inventoryEntity);

                await this.setFormularyLevelOrderedQuantity(addInventoryDto);

                return HttpResponse.created(inventoryEntity);
            }

            await this.upsert({inventoryId: inventoryEntity.inventoryId}, inventoryEntity);

            await this.receiveControlledDrug(formulary, inventoryEntity, addInventoryDto);

            await inventoryControlService.addInventoryControl({
                receiverName: addInventoryDto.receiverName,
                witnessName: addInventoryDto.witnessName,
                signature: addInventoryDto.signature,
                facilityId: addInventoryDto.facilityId,
                inventoryId: inventoryEntity.inventoryId
            });

            return HttpResponse.created(inventoryEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async receiveControlledDrug(
        formulary: FormularyEntity,
        inventoryEntity: InventoryEntity,
        addInventoryDto: AddInventoryDto
    ) {
        const isPatientSpecfic = addInventoryDto.controlledType === CONTROLLED_TYPE.PATIENT_SPECIFIC;
        const isStock = addInventoryDto.controlledType === CONTROLLED_TYPE.STOCK;
        const isArv = formulary.drugClass === DRUG_CLASSES.ARV;
        const isEdit = addInventoryDto.action === "edit";

        const searchFilters = ControlledDrugFilter.setFilter(
            addInventoryDto.controlledDrugAutoId
                ? {
                      id: addInventoryDto.controlledDrugAutoId
                  }
                : {
                      controlledId: addInventoryDto.controlledId as string,
                      inventoryId: inventoryEntity.inventoryId,
                      cartId: isPatientSpecfic ? addInventoryDto.cartId : undefined,
                      tr: !isArv && isStock ? addInventoryDto.tr : undefined,
                      rx: !isArv && isPatientSpecfic ? addInventoryDto.rx : undefined
                  }
        );

        const isControlledDrug = await controlledDrugService.fetch(searchFilters);
        const controlledDrugEntity = ControlledDrugEntity.create(addInventoryDto);
        controlledDrugEntity.controlledDrugId = isControlledDrug
            ? isControlledDrug.controlledDrugId
            : SharedUtils.shortUuid();
        controlledDrugEntity.controlledType = addInventoryDto.controlledType as string;
        controlledDrugEntity.controlledQuantity =
            isControlledDrug && !isEdit
                ? isControlledDrug.controlledQuantity + addInventoryDto.quantity
                : addInventoryDto.quantity;
        controlledDrugEntity.inventoryId = inventoryEntity.inventoryId;

        await controlledDrugService.upsert(
            {controlledDrugId: controlledDrugEntity.controlledDrugId},
            controlledDrugEntity
        );

        isStock &&
            (await this.setFormularyLevelOrderedQuantity({...addInventoryDto, formularyId: formulary.formularyId}));
        isPatientSpecfic &&
            (await perpetualInventoryService.addPerpetualInventory(
                AddPerpetualInventoryDto.create({
                    ...controlledDrugEntity,
                    controlledId: controlledDrugEntity.controlledId,
                    facilityId: inventoryEntity.facilityId,
                    quantityAllocated: addInventoryDto.quantity,
                    rx: controlledDrugEntity.rx,
                    name: formulary.name,
                    controlledDrugId: controlledDrugEntity.controlledDrugId,
                    patientName: controlledDrugEntity.patientName,
                    providerName: controlledDrugEntity.providerName,
                    cartId: addInventoryDto.cartId,
                    isPatientSpecific: true
                })
            ));
    }

    async setFormularyLevelOrderedQuantity(addInventoryDto: {
        formularyId: string;
        facilityId: string;
        quantity: number;
    }) {
        const formularyLevel = await formularyLevelService.fetch({
            formularyId: addInventoryDto.formularyId,
            facilityId: addInventoryDto.facilityId
        });
        if (formularyLevel) {
            const newOrderedQuantity = formularyLevel.orderedQuantity - addInventoryDto.quantity;

            await formularyLevelService.update(
                {formularyLevelId: formularyLevel.formularyLevelId},
                FormularyLevelEntity.create({
                    orderedQuantity: newOrderedQuantity < 0 ? 0 : newOrderedQuantity
                })
            );
        }
    }

    async subGetFormularyWithInventory(getInventoryDto: GetInventoryDto) {
        const formularies = await formularyService.fetchAllWithInventory(getInventoryDto);
        if (!formularies) {
            return false;
        }

        const inventoryEntities = formularies.map((form) => {
            const totalQuantity = this.totalQuantity(form, form.inventory);

            const inventoryEntities = form.inventory.map((fi) => ({
                ...InventoryEntity.publicFields(fi),
                controlledDrug: fi.controlledDrug
                    .filter((cd) => cd.controlledType === CONTROLLED_TYPE.STOCK)
                    .map((cd) => ControlledDrugEntity.create(cd))
            }));

            const stockSpecifcFilteredInventory = inventoryEntities.filter((invFi) => invFi.controlledDrug.length > 0);

            return {
                formulary: FormularyEntity.publicFields(form),
                inventory: form.isControlled ? stockSpecifcFilteredInventory : inventoryEntities,
                totalQuantity: totalQuantity
            };
        });

        return inventoryEntities;
    }

    async subGetInventory(getInventoryDto: GetInventoryDto, paginationDto?: PaginationDto) {
        const pagination = PaginationOptions.create(paginationDto);
        const formulary = await formularyService.fetchPaginatedWithLevelAndInventory(
            {...getInventoryDto, fromInventory: true},
            pagination
        );
        if (!formulary) {
            return false;
        }

        const inventoryEntities = formulary.rows.map((form) => {
            const formularyLevel = form.formularyLevel.find((fl) => fl.facilityId === getInventoryDto.facilityId);

            const totalQuantity = this.totalQuantity(form, form.inventory);

            const inventoryEntities = form.inventory.map((fi) => ({
                ...InventoryEntity.publicFields(fi),
                controlledDrug: fi.controlledDrug
                    .filter((cd) => cd.controlledType === CONTROLLED_TYPE.STOCK)
                    .map((cd) => ControlledDrugEntity.create(cd))
            }));

            const stockSpecifcFilteredInventory = inventoryEntities.filter((invFi) => invFi.controlledDrug.length > 0);

            return {
                formulary: FormularyEntity.publicFields(form),
                inventory: form.isControlled ? stockSpecifcFilteredInventory : inventoryEntities,
                formularyLevel: formularyLevel ? FormularyLevelEntity.create(formularyLevel) : {},
                totalQuantity: totalQuantity,
                orderedQuantity: formularyLevel && formularyLevel.orderedQuantity
            };
        });

        return PaginationData.getPaginatedData(pagination, formulary.count, inventoryEntities);
    }

    async getInventory(getInventoryDto: GetInventoryDto, paginationDto: PaginationDto) {
        try {
            const inventory = await this.subGetInventory(getInventoryDto, paginationDto);
            if (!inventory) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok(inventory);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async updateInventory(updateInventoryDto: UpdateInventoryDto) {
        try {
            const inventory = await this.fetch({inventoryId: updateInventoryDto.inventoryId});
            if (!inventory) {
                return HttpResponse.notFound();
            }

            const inventoryEntity = InventoryEntity.create({...inventory, ...updateInventoryDto});

            await this.update({inventoryId: updateInventoryDto.inventoryId}, inventoryEntity);

            if ("isActive" in updateInventoryDto && !updateInventoryDto.isActive) {
                const formulary = await formularyService.fetch({formularyId: inventory?.formularyId});

                if (formulary && formulary?.isControlled) {
                    const controlledDrugs = await controlledDrugService.fetchAll(
                        {inventoryId: updateInventoryDto.inventoryId},
                        {}
                    );
                    if (controlledDrugs && controlledDrugs?.length > 0) {
                        await async.eachSeries(controlledDrugs, async (cDrug) => {
                            try {
                                await controlledDrugService.subAddControlledDrugNotification({
                                    controlledDrugId: cDrug?.controlledDrugId,
                                    facilityId: updateInventoryDto?.facilityId ?? "",
                                    notificationType: "CONTROLLED_DRUG_STATUS"
                                });
                            } catch (error) {
                                ErrorLog(error);
                            }
                        });
                    }
                }
            }

            return HttpResponse.ok(inventoryEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async updateInventoryStatus(params: {formularyId: string; isActive: boolean}) {
        await this.update({formularyId: params.formularyId}, {isActive: params.isActive} as InventoryEntity);
    }

    async removeInventory(removeInventoryDto: RemoveInventoryDto) {
        try {
            const inventory = await this.fetch({inventoryId: removeInventoryDto.inventoryId});
            if (!inventory) {
                return HttpResponse.notFound();
            }

            await this.remove({inventoryId: removeInventoryDto.inventoryId});

            const formulary = await formularyService.fetch({formularyId: inventory?.formularyId});

            if (formulary && formulary?.isControlled) {
                const controlledDrugs = await controlledDrugService.fetchAll(
                    {inventoryId: removeInventoryDto.inventoryId},
                    {}
                );
                if (controlledDrugs && controlledDrugs?.length > 0) {
                    await async.eachSeries(controlledDrugs, async (cDrug) => {
                        try {
                            await controlledDrugService.subAddControlledDrugNotification({
                                controlledDrugId: cDrug?.controlledDrugId,
                                facilityId: removeInventoryDto?.facilityId,
                                notificationType: "CONTROLLED_DRUG_DELETE"
                            });
                        } catch (error) {
                            ErrorLog(error);
                        }
                    });
                }
            }

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getInventorySuggestions(getInventorySuggestionDto: GetInventorySuggestionDto) {
        try {
            const inventory = await this.fetchAll(
                {formularyId: getInventorySuggestionDto.formularyId as string},
                {ndc: ORDER_BY.ASC}
            );
            if (!inventory) {
                return HttpResponse.notFound();
            }

            const inventoryEntities = inventory.map((i) => InventoryEntity.publicFields(i));

            return HttpResponse.ok(inventoryEntities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subGetAllInventory(getAllInventoryDto: GetAllInventoryDto) {
        const formulary = await formularyService.fetchAllWithLevelAndInventory({
            pastExpiry: getAllInventoryDto.pastExpiry,
            facilityId: getAllInventoryDto.facilityId as string,
            formularyLevelFacilityId: getAllInventoryDto.facilityId as string,
            facilityIdWithoutPending: true,
            isControlled: getAllInventoryDto.isControlled as boolean
        });
        if (!formulary) {
            return false;
        }

        return formulary.map((form) => {
            return {
                ...FormularyEntity.publicFields(form),
                ...InventoryEntity.create(form),
                ...FormularyLevelEntity.create(form),
                ...ControlledDrugEntity.create(form),
                formularyAutoId: form.idFormulary,
                inventoryAutoId: form.idInventory,
                controlledDrugAutoId: form.idControlledDrug,
                quantity: form.isControlled ? form.controlledQuantity : form.quantityInventory,
                formularyId: undefined,
                isActive: form.isActiveInventory
            };
        });
    }

    async getAllInventory(getAllInventoryDto: GetAllInventoryDto) {
        try {
            const inventoryEntities = await this.subGetAllInventory(getAllInventoryDto);
            if (!inventoryEntities) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok(inventoryEntities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getControlledIds(getControlledIdDto: GetControlledIdDto) {
        try {
            const searchFilters = InventoryFilter.setFilter({...getControlledIdDto, isActive: true});
            const inventory = await this.fetchAll(searchFilters, {});
            if (!inventory) {
                return HttpResponse.notFound();
            }

            const inventoryIds = inventory.map((inv) => inv.inventoryId);
            const controlledDrugFilters = ControlledDrugFilter.setFilter({
                inventoryId: inventoryIds,
                controlledQuantity: 1,
                controlledType: CONTROLLED_TYPE.STOCK
            });
            const controlledDrugs = await controlledDrugService.fetchAll(controlledDrugFilters, {
                controlledId: ORDER_BY.ASC
            });
            if (!controlledDrugs) {
                return HttpResponse.notFound();
            }

            const controlledIds = controlledDrugs.map((cd) => ({
                controlledId: cd.controlledId,
                tr: cd.tr,
                controlledDrugId: cd.controlledDrugId
            }));

            return HttpResponse.ok(controlledIds);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subAddFormularyNotification(props: {formularyId: string; facilityId: string}) {
        const admins = await adminService.fetchAllByQueryWithRoleServiceList({
            facilityId: props.facilityId,
            permission: "WRITE",
            serviceName: "INVENTORY"
        });

        if (!admins) {
            return;
        }

        const notificationEntity = await notificationService.subAddNotification(
            AddNotificationDto.create({
                repository: REPOSITORIES.FORMULARY,
                repositoryId: props.formularyId,
                type: INVENTORY_NOTIFICATION_TYPES.INVENTORY_DEPLETE,
                facilityId: props.facilityId
            })
        );

        const isNotification = await notificationService.subGetNotification({
            notificationId: notificationEntity.notificationId
        });
        if (!isNotification) {
            return;
        }

        await async.eachSeries(admins, async (admin) => {
            try {
                await notificationAdminService.subAddNotificationAdmin(
                    isNotification,
                    AddNotificationAdminDto.create({
                        notificationId: isNotification.notificationId,
                        adminId: admin.adminId
                    })
                );
            } catch (error) {
                ErrorLog(error);
            }
        });
    }

    async cartRequestInventoryDeduction(props: {
        tobeDeductedQuantity: number;
        formularyId: string;
        facilityId: string;
        type?: string;
        cartRequestDrugId?: string;
        referenceGuideDrugId?: string;
        packageQuantity: number;
        controlledId?: string;
        tr?: string;
    }) {
        const inventory = await this.fetchAll(
            {
                formularyId: props.formularyId,
                facilityId: props.facilityId,
                isActive: true
            },
            {expirationDate: ORDER_BY.ASC}
        );

        if (!inventory) {
            return;
        }

        if (props.controlledId) {
            await this.controlledDeduction({
                ...props,
                controlledId: props.controlledId as string,
                inventory: inventory
            });
        }

        if (!props.controlledId) {
            await this.uncontrolledDeduction({...props, inventory: inventory});
        }

        const formulary = await this.subGetFormularyWithInventory({formularyId: props.formularyId});
        if (!formulary) {
            return;
        }
        if (formulary[0] && !formulary[0].formulary.isFormulary && formulary[0].totalQuantity <= 0) {
            await this.subAddFormularyNotification({facilityId: props.facilityId, formularyId: props.formularyId});
        }
    }

    private async controlledDeduction(props: {
        formularyId: string;
        facilityId: string;
        inventory: Inventory[];
        tobeDeductedQuantity: number;
        type?: string;
        cartRequestDrugId?: string;
        referenceGuideDrugId?: string;
        packageQuantity: number;
        controlledId: string;
        tr?: string;
    }) {
        const inventory = props.inventory;

        const searchFilters = ControlledDrugFilter.setFilter({
            controlledId: props.controlledId,
            tr: props.tr,
            inventoryId: inventory.map((i) => i.inventoryId)
        });
        const controlledDrug = await controlledDrugService.fetchAll(searchFilters, {});
        if (!controlledDrug) {
            return;
        }

        const controlledDrugWithInventory = controlledDrug
            .map((cd) => {
                const controlledInventory = inventory.find((i) => i.inventoryId === cd.inventoryId);

                return {
                    ...cd,
                    inventory: controlledInventory
                };
            })
            .sort((a, b) =>
                (a.inventory as Inventory).expirationDate.localeCompare((b.inventory as Inventory).expirationDate)
            );

        const cartRequestDrug = await cartRequestDrugService.fetch({
            cartRequestDrugId: props.cartRequestDrugId as string
        });
        if (!cartRequestDrug) {
            return;
        }

        const formulary = await formularyService.fetch({formularyId: props.formularyId});
        if (!formulary) {
            return;
        }

        for (const controlledDrug of controlledDrugWithInventory) {
            if (props.tobeDeductedQuantity <= 0) {
                break;
            }

            const isControlledDrugQuantityHigher = controlledDrug.controlledQuantity > props.tobeDeductedQuantity;

            const controlledQuantity = controlledDrug.controlledQuantity - props.tobeDeductedQuantity;

            const isAllCurrentControlledDepleted = !isControlledDrugQuantityHigher;

            const toBeAllocated = isAllCurrentControlledDepleted
                ? props.tobeDeductedQuantity - controlledDrug.controlledQuantity
                : 0;

            await controlledDrugService.update({controlledDrugId: controlledDrug.controlledDrugId as string}, {
                controlledQuantity: isControlledDrugQuantityHigher ? controlledQuantity : 0
            } as never);

            await cartRequestDrugService.update({cartRequestDrugId: props.cartRequestDrugId as string}, {
                totalUnits: toBeAllocated,
                allocationStatus:
                    toBeAllocated > 0 &&
                    props.type !== CART_REQUEST_TYPE.AFTER_HOUR &&
                    props.type !== CART_REQUEST_TYPE.INITIAL_ALLOCATION
                        ? CART_ALLOCATION_STATUS.PARTIAL
                        : CART_ALLOCATION_STATUS.FULFILLED
            } as never);

            const cartRequestDeductionEntity = CartRequestDeductionEntity.create({
                cartRequestDeductionId: SharedUtils.shortUuid(),
                quantity: isControlledDrugQuantityHigher
                    ? props.tobeDeductedQuantity
                    : controlledDrug.controlledQuantity,
                controlledDrugId: controlledDrug.controlledDrugId,
                facilityId: props.facilityId,
                cartRequestDrugId: props.cartRequestDrugId
            });

            if (
                props.type === CART_REQUEST_TYPE.ALLOCATION ||
                props.type === CART_REQUEST_TYPE.AFTER_HOUR ||
                props.type === CART_REQUEST_TYPE.INITIAL_ALLOCATION
            ) {
                await cartRequestDeductionService.create(cartRequestDeductionEntity);

                if (cartRequestDrug.allocationStatus !== CART_ALLOCATION_STATUS.PARTIAL) {
                    await perpetualInventoryService.addPerpetualInventory(
                        AddPerpetualInventoryDto.create({
                            controlledId: props.controlledId,
                            facilityId: props.facilityId,
                            quantityAllocated: isControlledDrugQuantityHigher
                                ? props.tobeDeductedQuantity
                                : controlledDrug.controlledQuantity,
                            cartRequestDeductionId: cartRequestDeductionEntity.cartRequestDeductionId,
                            tr: controlledDrug.tr,
                            name: formulary.name,
                            controlledDrugId: controlledDrug.controlledDrugId,
                            cartId: cartRequestDrug.cartId,
                            isPatientSpecific: false
                        })
                    );
                }
            }

            props.tobeDeductedQuantity = toBeAllocated;
        }
    }

    private async uncontrolledDeduction(props: {
        tobeDeductedQuantity: number;
        formularyId: string;
        facilityId: string;
        type?: string;
        cartRequestDrugId?: string;
        referenceGuideDrugId?: string;
        packageQuantity: number;
        controlledId?: string;
        tr?: string;
        inventory: Inventory[];
    }) {
        let totalQuantity = 0;

        for (const [i, inv] of props.inventory.entries()) {
            if (props.tobeDeductedQuantity <= inv.quantity) {
                const deductedQuantity = inv.quantity - props.tobeDeductedQuantity;
                await this.update({inventoryId: inv.inventoryId}, {
                    quantity: deductedQuantity
                } as never);

                totalQuantity += deductedQuantity;

                (props.type === CART_REQUEST_TYPE.ALLOCATION || props.type === CART_REQUEST_TYPE.INITIAL_ALLOCATION) &&
                    (await cartRequestDeductionService.create(
                        CartRequestDeductionEntity.create({
                            cartRequestDeductionId: SharedUtils.shortUuid(),
                            quantity: props.tobeDeductedQuantity,
                            inventoryId: inv.inventoryId,
                            facilityId: props.facilityId,
                            cartRequestDrugId: props.cartRequestDrugId
                        })
                    ));

                await cartRequestDrugService.update({cartRequestDrugId: props.cartRequestDrugId as string}, {
                    totalUnits: 0
                } as never);

                break;
            }

            const isLastNdcDepleted = props.tobeDeductedQuantity > 0 && i === props.inventory.length - 1;

            const deductedQuantity = isLastNdcDepleted
                ? inv.quantity - props.tobeDeductedQuantity
                : props.tobeDeductedQuantity - inv.quantity;

            const newQuantity = deductedQuantity > 0 && i !== props.inventory.length - 1 ? 0 : deductedQuantity;

            await this.update({inventoryId: inv.inventoryId}, {
                quantity: newQuantity
            } as never);

            totalQuantity += deductedQuantity;

            await cartRequestDrugService.update({cartRequestDrugId: props.cartRequestDrugId as string}, {
                totalUnits: deductedQuantity > 0 ? deductedQuantity : 0
            } as never);

            props.type === CART_REQUEST_TYPE.ALLOCATION &&
                (await cartRequestDeductionService.create(
                    CartRequestDeductionEntity.create({
                        cartRequestDeductionId: SharedUtils.shortUuid(),
                        quantity:
                            deductedQuantity <= 0
                                ? props.tobeDeductedQuantity
                                : props.tobeDeductedQuantity - deductedQuantity,
                        inventoryId: inv.inventoryId,
                        facilityId: props.facilityId,
                        cartRequestDrugId: props.cartRequestDrugId
                    })
                ));

            props.tobeDeductedQuantity = deductedQuantity;
        }
    }

    async cartRequestRevertInventoryDeduction(props: {cartRequestDrugId: string}) {
        const cartRequestDeductions = await cartRequestDeductionService.fetchAll(
            {
                cartRequestDrugId: props.cartRequestDrugId
            },
            {}
        );

        if (!cartRequestDeductions) {
            return;
        }

        const cartRequestDrug = await cartRequestDrugService.fetch({cartRequestDrugId: props.cartRequestDrugId});
        if (!cartRequestDrug) {
            return;
        }

        let totalUnits: number = cartRequestDrug.totalUnits;
        await async.eachSeries(cartRequestDeductions, async (cartRequestDeduction) => {
            totalUnits += cartRequestDeduction.quantity;
            if (cartRequestDeduction.controlledDrugId) {
                const controlledDrug = await controlledDrugService.fetch({
                    controlledDrugId: cartRequestDeduction.controlledDrugId
                });
                if (!controlledDrug) {
                    return;
                }

                const revertedQuantity = controlledDrug.controlledQuantity + cartRequestDeduction.quantity;
                await controlledDrugService.update({controlledDrugId: cartRequestDeduction.controlledDrugId}, {
                    controlledQuantity: revertedQuantity
                } as never);

                if (cartRequestDrug.fromPartial) {
                    const mainCartRequestDrug = await cartRequestDrugService.fetch({
                        cartRequestFormId: cartRequestDrug.cartRequestFormId,
                        formularyId: cartRequestDrug.formularyId,
                        referenceGuideDrugId: cartRequestDrug.referenceGuideDrugId,
                        fromPartial: IsNull()
                    });

                    if (!mainCartRequestDrug) {
                        return;
                    }

                    await cartRequestDrugService.update(
                        {
                            cartRequestDrugId: mainCartRequestDrug.cartRequestDrugId
                        },
                        {
                            totalUnits: cartRequestDeduction.quantity + mainCartRequestDrug.totalUnits,
                            allocationStatus: CART_ALLOCATION_STATUS.PARTIAL
                        } as never
                    );

                    await cartRequestDrugService.remove({cartRequestDrugId: cartRequestDrug.cartRequestDrugId});

                    await perpetualInventoryService.revertPerpetualInventory(
                        RevertPerpetualInventoryDto.create({
                            cartRequestDeductionId: cartRequestDeduction.cartRequestDeductionId
                        })
                    );

                    await cartRequestDeductionService.remove({
                        cartRequestDeductionId: cartRequestDeduction.cartRequestDeductionId
                    });

                    return;
                }

                await cartRequestDrugService.update(
                    {
                        cartRequestDrugId: cartRequestDeduction.cartRequestDrugId
                    },
                    {totalUnits} as never
                );

                await perpetualInventoryService.revertPerpetualInventory(
                    RevertPerpetualInventoryDto.create({
                        cartRequestDeductionId: cartRequestDeduction.cartRequestDeductionId
                    })
                );

                await cartRequestDeductionService.remove({
                    cartRequestDeductionId: cartRequestDeduction.cartRequestDeductionId
                });

                return;
            }

            const inventory = await this.fetch({inventoryId: cartRequestDeduction.inventoryId});
            if (!inventory) {
                return;
            }

            const revertedQuantity = inventory.quantity + cartRequestDeduction.quantity;

            await cartRequestDrugService.update(
                {
                    cartRequestDrugId: cartRequestDeduction.cartRequestDrugId
                },
                {totalUnits: cartRequestDrug.totalUnits + cartRequestDeduction.quantity} as never
            );

            await this.update({inventoryId: cartRequestDeduction.inventoryId}, {
                quantity: revertedQuantity
            } as never);

            await cartRequestDeductionService.remove({
                cartRequestDeductionId: cartRequestDeduction.cartRequestDeductionId
            });
        });
    }

    async getSingleInventoryById(searchBy: {id?: number; inventoryId?: string}) {
        const inventory = searchBy.id
            ? await this.fetch({id: searchBy.id})
            : await this.fetch({inventoryId: searchBy.inventoryId as string});
        if (!inventory) {
            return false;
        }

        return InventoryEntity.publicFields(inventory);
    }

    totalQuantity(formulary: Formulary, inventory: Inventory[]) {
        return inventory.reduce((accumulator, currentValue) => {
            if (formulary.isControlled) {
                accumulator += currentValue.controlledDrug.reduce((acc, cd) => acc + cd.controlledQuantity, 0);

                return accumulator;
            }

            accumulator += currentValue.quantity;

            return accumulator;
        }, 0);
    }
}
