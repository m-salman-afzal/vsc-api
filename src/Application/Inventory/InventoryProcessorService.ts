import async from "async";
import {injectable} from "tsyringe";
import {ZodError} from "zod";
import {fromZodError} from "zod-validation-error";

import {InventoryEntity} from "@entities/Inventory/InventoryEntity";

import {PERMISSIONS} from "@constants/AuthConstant";
import {BUCKETS, FCH_BUCKET_FOLDERS} from "@constants/CloudStorageConstant";
import {FILE_STATUSES, INVENTORY_FILE_PROCESSES, REPOSITORIES, ROW_ACTION} from "@constants/FileConstant";
import {DRUG_CLASSES} from "@constants/FormularyConstant";
import {VALIDATION_MESSAGES_VALUE_OBJECTS} from "@constants/ValidationMessagesConstant";

import {InventoryValidation} from "@validations/InventoryValidation";

import SharedUtils from "@appUtils/SharedUtils";

import {InventoryFilter} from "@repositories/Shared/ORM/InventoryFilter";

import {
    adminService,
    cloudStorageUtils,
    controlledDrugService,
    fileService,
    formularyLevelService,
    formularyService,
    inventoryService
} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

import {AddInventoryDto} from "./Dtos/AddInventoryDto";
import {BulkAddControlledInventoryDto} from "./Dtos/BulkAddControlledInventoryDto";
import {BulkAddNonControlledInventoryDto} from "./Dtos/BulkAddNonControlledInventoryDto";
import {InventoryService} from "./InventoryService";

import type {ControlledDrugEntity} from "@entities/ControlledDrug/ControlledDrugEntity";
import type {FormularyEntity} from "@entities/Formulary/FormularyEntity";

type BulkAddInventoryType = Partial<BulkAddNonControlledInventoryDto & BulkAddControlledInventoryDto>;

@injectable()
export class InventoryProcessorService extends InventoryService {
    private async createInventory(
        bulkAddInventoryDto: Partial<BulkAddNonControlledInventoryDto>,
        formularyEntity: FormularyEntity
    ) {
        const inventoryEntity = InventoryEntity.create(bulkAddInventoryDto);
        inventoryEntity.formularyId = formularyEntity.formularyId;
        inventoryEntity.inventoryId = SharedUtils.shortUuid();
        inventoryEntity.isActive = formularyEntity.isActive;

        return await this.create(inventoryEntity);
    }

    private async createControlledInventory(
        bulkAddInventoryDto: Partial<BulkAddControlledInventoryDto>,
        formularyEntity: FormularyEntity,
        action?: string,
        inventory?: InventoryEntity
    ) {
        let inventoryEntity: InventoryEntity;

        const searchFilters = InventoryFilter.setFilter({
            lotNo: bulkAddInventoryDto.lotNo as string,
            facilityId: bulkAddInventoryDto.facilityId as string,
            formularyId: formularyEntity.formularyId as string,
            manufacturer: bulkAddInventoryDto.manufacturer as string,
            expirationDate: bulkAddInventoryDto.expirationDate as string,
            ndc: bulkAddInventoryDto.ndc as string
        });

        const isInventory = await this.fetch(searchFilters);

        if (isInventory) {
            inventoryEntity = InventoryEntity.create(isInventory);
        } else if (action === "edit") {
            inventoryEntity = InventoryEntity.create(bulkAddInventoryDto);
            inventoryEntity.inventoryId = inventory?.inventoryId as string;

            await this.update(
                {inventoryId: inventoryEntity.inventoryId as string},
                InventoryEntity.create({
                    ...inventoryEntity
                })
            );
        } else {
            inventoryEntity = await this.createInventory(bulkAddInventoryDto, formularyEntity);
        }

        return await inventoryService.receiveControlledDrug(
            formularyEntity,
            inventoryEntity,
            AddInventoryDto.create({
                ...bulkAddInventoryDto,
                controlledType: "STOCK",
                quantity: bulkAddInventoryDto.controlledQuantity,
                action
            })
        );
    }

    private validateInventoryAction(inv: BulkAddInventoryType, isControlled: boolean): void {
        switch (inv.action) {
            case ROW_ACTION.ADD:
            case ROW_ACTION.REPLEN:
                isControlled
                    ? InventoryValidation.bulkAddControlledInventoryValidation(inv)
                    : InventoryValidation.bulkAddNonControlledInventoryValidation(inv);
                break;
            case ROW_ACTION.EDIT:
                isControlled
                    ? InventoryValidation.bulkEditControlledInventoryValidation(inv)
                    : InventoryValidation.bulkEditNonControlledInventoryValidation(inv);
                break;
            case ROW_ACTION.DELETE:
                isControlled
                    ? InventoryValidation.bulkRemoveControlledInventoryValidation(inv)
                    : InventoryValidation.bulkRemoveNonControlledInventoryValidation(inv);
                break;
            default:
                throw new Error("Invalid action");
        }
    }

    private async createAndUpdateInventory(
        bulkAddInventoryDto: Partial<BulkAddInventoryType>,
        formularyEntity: FormularyEntity,
        isControlled: boolean,
        inventory: InventoryEntity
    ): Promise<number> {
        if (isControlled) {
            if (inventory) {
                const isControlledDrug = await controlledDrugService.fetch({
                    controlledId: bulkAddInventoryDto.controlledId as string,
                    tr: bulkAddInventoryDto.tr as string,
                    inventoryId: inventory.inventoryId
                });

                if (isControlledDrug) {
                    throw Error("Controlled ID already exist");
                }
            }

            await this.createControlledInventory(bulkAddInventoryDto, formularyEntity);

            return bulkAddInventoryDto.controlledQuantity as number;
        } else {
            if (inventory) {
                throw new Error("NDC already exist");
            }
            await this.createInventory(bulkAddInventoryDto, formularyEntity);

            return bulkAddInventoryDto.quantity as number;
        }
    }

    private async updateAndReplenishInventory(
        isInventory: InventoryEntity,
        bulkAddInventoryDto: Partial<InventoryEntity & ControlledDrugEntity>,
        formularyEntity: FormularyEntity,
        isControlled: boolean
    ): Promise<number> {
        if (!isInventory) {
            throw new Error("NDC not found");
        }

        if (isControlled) {
            if (isInventory) {
                const isControlledDrug = await controlledDrugService.fetch({
                    controlledId: bulkAddInventoryDto.controlledId as string,
                    tr: bulkAddInventoryDto.tr as string,
                    inventoryId: isInventory.inventoryId
                });

                if (!isControlledDrug) {
                    throw new Error("Controlled Id not found");
                }
            }
            await inventoryService.receiveControlledDrug(
                formularyEntity,
                InventoryEntity.create({
                    ...isInventory,
                    ...bulkAddInventoryDto,
                    quantity: bulkAddInventoryDto.controlledQuantity
                }),
                AddInventoryDto.create({
                    ...bulkAddInventoryDto,
                    controlledType: "STOCK",
                    quantity: bulkAddInventoryDto.controlledQuantity
                })
            );

            return bulkAddInventoryDto.controlledQuantity as number;
        } else {
            isInventory.quantity += bulkAddInventoryDto.quantity!;
            await this.updateInventory(isInventory);
            await this.setFormularyLevelOrderedQuantity({
                formularyId: isInventory.formularyId,
                facilityId: isInventory.facilityId,
                quantity: isInventory.quantity
            });

            return bulkAddInventoryDto.quantity as number;
        }
    }

    private async editInventory(
        bulkAddInventoryDto: BulkAddInventoryType,
        formularyEntity: FormularyEntity,
        isControlled: boolean
    ): Promise<number> {
        const searchFilter = InventoryFilter.setFilter({
            id: bulkAddInventoryDto.inventoryAutoId as number
        });
        const isInventory = await this.fetch(searchFilter);

        if (!isInventory) {
            throw Error("NDC does not exist");
        }
        if (isControlled) {
            const isControlledDrug = await controlledDrugService.fetch({
                id: bulkAddInventoryDto.controlledDrugAutoId as number,
                inventoryId: isInventory.inventoryId as string
            });

            if (!isControlledDrug) {
                throw new Error("Controlled Id not found");
            }

            await this.createControlledInventory(bulkAddInventoryDto, formularyEntity, "edit", isInventory);

            return bulkAddInventoryDto.controlledQuantity as number;
        } else {
            isInventory.quantity = bulkAddInventoryDto.quantity ?? 0;
            await this.update(
                {inventoryId: isInventory.inventoryId as string},
                InventoryEntity.create({
                    ...isInventory,
                    ...bulkAddInventoryDto
                })
            );

            return isInventory.quantity;
        }
    }

    private async deleteInventory(
        isInventory: InventoryEntity,
        bulkAddInventoryDto: BulkAddInventoryType,
        isControlled: boolean
    ): Promise<void> {
        if (!isInventory) {
            throw Error("NDC does not exist");
        }
        if (isControlled) {
            const controlledDrug = await controlledDrugService.fetch({
                id: bulkAddInventoryDto.controlledDrugAutoId as number,
                controlledId: bulkAddInventoryDto.controlledId as string,
                tr: bulkAddInventoryDto.tr as string,
                inventoryId: isInventory.inventoryId
            });
            if (!controlledDrug) {
                throw Error("Controlled drug not found");
            }

            await controlledDrugService.remove({
                inventoryId: isInventory.inventoryId,
                id: bulkAddInventoryDto.controlledDrugAutoId as number
            });

            const isMoreInventory = await controlledDrugService.fetchAll({inventoryId: isInventory.inventoryId}, {});

            if (!isMoreInventory) {
                await this.remove({inventoryId: isInventory.inventoryId});
            }
        } else {
            await this.remove({inventoryId: isInventory.inventoryId});
        }
    }

    private async processInventoryAction(
        inv: BulkAddInventoryType,
        isInventory: InventoryEntity | boolean,
        bulkAddInventoryDto: Partial<InventoryEntity>,
        formularyEntity: FormularyEntity,
        isControlled: boolean
    ): Promise<any> {
        const processedInfo = {
            addedCount: 0,
            updatedCount: 0,
            removedCount: 0,
            inventoryQuantity: 0
        };
        switch (inv.action) {
            case ROW_ACTION.ADD:
                processedInfo.inventoryQuantity = await this.createAndUpdateInventory(
                    bulkAddInventoryDto,
                    formularyEntity,
                    isControlled,
                    isInventory as unknown as InventoryEntity
                );
                processedInfo.addedCount++;
                break;
            case ROW_ACTION.REPLEN:
                processedInfo.inventoryQuantity = await this.updateAndReplenishInventory(
                    isInventory as InventoryEntity,
                    bulkAddInventoryDto,
                    formularyEntity,
                    isControlled
                );
                processedInfo.updatedCount++;
                break;
            case ROW_ACTION.EDIT:
                processedInfo.inventoryQuantity = await this.editInventory(
                    bulkAddInventoryDto,
                    formularyEntity,
                    isControlled
                );
                processedInfo.updatedCount++;
                break;
            case ROW_ACTION.DELETE:
                await this.deleteInventory(isInventory as InventoryEntity, bulkAddInventoryDto, isControlled);
                processedInfo.removedCount++;
                break;
            default:
                throw new Error("Wrong action");
        }

        return processedInfo;
    }

    private async bulkAddInventoryHandler(
        transformedInventory: BulkAddInventoryType[],
        facilityId: string,
        inventory: BulkAddInventoryType[],
        rbac: Record<string, string>,
        isControlled: boolean,
        process: any
    ) {
        const failedRows: [] = [];
        const rbacPermission = isControlled ? rbac["formularyControlled"] : rbac["formularyNonControlled"];
        let addedCount = 0;
        let updatedCount = 0;
        let removedCount = 0;
        let failedCount = 0;
        let inventoryQuantity = 0;
        const formularyIds: string[] = [];

        let processedNumber = -1;

        const validAddProcesses = [
            INVENTORY_FILE_PROCESSES.CONTROLLED_ADD,
            INVENTORY_FILE_PROCESSES.NON_CONTROLLED_ADD
        ];

        const validEditDeleteProcesses = [
            INVENTORY_FILE_PROCESSES.CONTROLLED_EDIT_DELETE,
            INVENTORY_FILE_PROCESSES.NON_CONTROLLED_EDIT_DELETE
        ];

        await async.eachSeries(transformedInventory, async (inv) => {
            try {
                processedNumber++;
                inv.facilityId = facilityId;

                if (rbacPermission === PERMISSIONS.HIDE) {
                    (inventory[processedNumber] as BulkAddInventoryType).failedReason =
                        VALIDATION_MESSAGES_VALUE_OBJECTS.INVALID_ACTION_RBAC;
                    failedRows.push(inventory[processedNumber] as never);
                    failedCount++;

                    return;
                }

                if (!inv.action) {
                    (inventory[processedNumber] as BulkAddInventoryType).failedReason =
                        'Validation error: Required at "action"';
                    failedRows.push(inventory[processedNumber] as never);
                    failedCount++;

                    return;
                }

                if (
                    (["add", "replen"].includes(inv.action) && !validAddProcesses.includes(process)) ||
                    (["delete", "edit"].includes(inv.action) && !validEditDeleteProcesses.includes(process))
                ) {
                    (inventory[processedNumber] as BulkAddInventoryType).failedReason = "Wrong action";
                    failedRows.push(inventory[processedNumber] as never);
                    failedCount++;

                    return;
                }

                this.validateInventoryAction(inv, isControlled);

                if (inv.expirationDate) {
                    inv.expirationDate = SharedUtils.setDate(inv.expirationDate);
                }

                const {formularyAutoId, ...bulkAddInventoryDto} = isControlled
                    ? BulkAddControlledInventoryDto.create(inv)
                    : BulkAddNonControlledInventoryDto.create(inv);

                const formularyEntity = await formularyService.getSingleFormularyById({id: formularyAutoId as number});

                if (!formularyEntity) {
                    (inventory[processedNumber] as BulkAddInventoryType).failedReason = "Formulary not found";
                    failedRows.push(inventory[processedNumber] as never);
                    failedCount++;

                    return;
                }

                const formularyLevelEntity = await formularyLevelService.fetch({
                    formularyId: formularyEntity.formularyId,
                    facilityId
                });

                if (!formularyLevelEntity) {
                    (inventory[processedNumber] as BulkAddInventoryType).failedReason = "Formulary level not found";
                    failedRows.push(inventory[processedNumber] as never);
                    failedCount++;

                    return;
                }

                if (formularyEntity.name !== inv.drug) {
                    (inventory[processedNumber] as BulkAddInventoryType).failedReason = "Drug name and id do not match";
                    failedRows.push(inventory[processedNumber] as never);
                    failedCount++;

                    return;
                }

                if (isControlled) {
                    if (formularyEntity.drugClass !== DRUG_CLASSES.ARV && (!inv.tr || inv.tr === "")) {
                        throw new Error("tr is required for all drug classes except antiretroviral");
                    }
                    if (formularyEntity.drugClass === DRUG_CLASSES.ARV && inv.tr) {
                        throw new Error("tr is not required for drug class antiretroviral");
                    }
                }

                const searchFilters = InventoryFilter.setFilter({
                    formularyId: formularyEntity.formularyId,
                    ndc: inv.ndc as string,
                    lotNo: inv.lotNo as string,
                    facilityId: inv.facilityId,
                    manufacturer: inv.manufacturer as string,
                    expirationDate: inv.expirationDate as string,
                    id: bulkAddInventoryDto.inventoryAutoId
                });

                const isInventory = await this.fetch(searchFilters);

                const {...processInfo} = await this.processInventoryAction(
                    inv,
                    isInventory,
                    bulkAddInventoryDto,
                    formularyEntity,
                    isControlled
                );

                formularyIds.push(formularyEntity.formularyId);

                addedCount += processInfo.addedCount;
                updatedCount += processInfo.updatedCount;
                removedCount += processInfo.removedCount;
                inventoryQuantity += processInfo.inventoryQuantity;
            } catch (error: any) {
                if (error instanceof ZodError) {
                    const errorMessage = fromZodError(error);
                    (inventory[processedNumber] as BulkAddInventoryType).failedReason = errorMessage.toString();
                } else {
                    (inventory[processedNumber] as BulkAddInventoryType).failedReason = error.message;
                }

                failedRows.push(inventory[processedNumber] as never);
                failedCount++;
            }
        });

        return {
            addedCount,
            updatedCount,
            removedCount,
            failedCount,
            inventoryQuantity,
            failedRows,
            drugCount: new Set(formularyIds).size
        };
    }

    private async subBulkAddInventory(
        transformedInventory: BulkAddNonControlledInventoryDto[],
        facilityId: string,
        inventory: BulkAddNonControlledInventoryDto[],
        rbac: Record<string, string>,
        process: string
    ) {
        return await this.bulkAddInventoryHandler(transformedInventory, facilityId, inventory, rbac, false, process);
    }

    private async subBulkAddControlledInventory(
        transformedInventory: BulkAddControlledInventoryDto[],
        facilityId: string,
        inventory: BulkAddControlledInventoryDto[],
        rbac: Record<string, string>,
        process: string
    ) {
        return await this.bulkAddInventoryHandler(transformedInventory, facilityId, inventory, rbac, true, process);
    }

    async bulkAddNonControlledInventory() {
        try {
            const files = await fileService.fetchBySearchQuery({
                status: FILE_STATUSES.RECEIVED,
                process: [
                    INVENTORY_FILE_PROCESSES.NON_CONTROLLED_ADD,
                    INVENTORY_FILE_PROCESSES.NON_CONTROLLED_EDIT_DELETE
                ] as unknown as string,
                repository: REPOSITORIES.INVENTORY
            });
            if (!files) {
                return;
            }

            await async.eachSeries(files, async (file) => {
                try {
                    await fileService.updateFile({...file, status: FILE_STATUSES.QUEUED});
                    const admin = await adminService.fetchByQuery({adminId: file.adminId});
                    const rbac = SharedUtils.setRoleServiceList(admin as any);

                    const csvString = await cloudStorageUtils.getFileContent(
                        BUCKETS.FCH,
                        `${FCH_BUCKET_FOLDERS.FACILITIES}/${file.facilityId}/${file.repository}/${file.fileId}.${file.fileExtension}`
                    );

                    const inventory = SharedUtils.csvToJson<BulkAddNonControlledInventoryDto>(csvString);
                    const transformedInventory = SharedUtils.convertStringToPrimitives(structuredClone(inventory), {
                        toNumberArray: ["formularyAutoId", "inventoryAutoId", "quantity"]
                    });

                    const {failedRows, ...processedInfo} = await this.subBulkAddInventory(
                        transformedInventory,
                        file.facilityId,
                        inventory,
                        rbac,
                        file.process
                    );

                    file.isEf = failedRows.length > 0;
                    file.info = processedInfo;
                    file.status = SharedUtils.setFileStatus(failedRows.length, transformedInventory.length);
                    await fileService.updateFile(file);

                    if (file.isEf) {
                        await cloudStorageUtils.uploadFile(
                            BUCKETS.FCH,
                            SharedUtils.jsonToCsv(failedRows),
                            `${FCH_BUCKET_FOLDERS.FACILITIES}/${file.facilityId}/${file.repository}/${file.fileId}-ef.${file.fileExtension}`
                        );
                    }
                } catch (error) {
                    file.status = FILE_STATUSES.FAILED;
                    await fileService.updateFile(file);
                    ErrorLog(error, {
                        prefixMessage: `${AppErrorMessage.BULK_ADD_INVENTORY.PROCESS}${AppErrorMessage.BULK_ADD_INVENTORY.ADD_INVENTORY}`
                    });
                }
            });
        } catch (error) {
            ErrorLog(error, {
                prefixMessage: `${AppErrorMessage.BULK_ADD_INVENTORY.PROCESS}${AppErrorMessage.GET_FILES}`
            });
        }
    }

    async bulkAddControlledInventoru() {
        try {
            const files = await fileService.fetchBySearchQuery({
                status: FILE_STATUSES.RECEIVED,
                process: [
                    INVENTORY_FILE_PROCESSES.CONTROLLED_ADD,
                    INVENTORY_FILE_PROCESSES.CONTROLLED_EDIT_DELETE
                ] as unknown as string,
                repository: REPOSITORIES.INVENTORY
            });
            if (!files) {
                return;
            }

            await async.eachSeries(files, async (file) => {
                try {
                    await fileService.updateFile({...file, status: FILE_STATUSES.QUEUED});
                    const admin = await adminService.fetchByQuery({adminId: file.adminId});
                    const rbac = SharedUtils.setRoleServiceList(admin as any);

                    const csvString = await cloudStorageUtils.getFileContent(
                        BUCKETS.FCH,
                        `${FCH_BUCKET_FOLDERS.FACILITIES}/${file.facilityId}/${file.repository}/${file.fileId}.${file.fileExtension}`
                    );

                    const inventory = SharedUtils.csvToJson<BulkAddControlledInventoryDto>(csvString);
                    const transformedInventory = SharedUtils.convertStringToPrimitives(structuredClone(inventory), {
                        toNumberArray: [
                            "controlledDrugAutoId",
                            "controlledQuantity",
                            "formularyAutoId",
                            "inventoryAutoId"
                        ]
                    });

                    const {failedRows, ...processedInfo} = await this.subBulkAddControlledInventory(
                        transformedInventory,
                        file.facilityId,
                        inventory,
                        rbac,
                        file.process
                    );

                    file.isEf = failedRows.length > 0;
                    file.status = SharedUtils.setFileStatus(failedRows.length, transformedInventory.length);
                    file.info = processedInfo;
                    await fileService.updateFile(file);

                    if (file.isEf) {
                        await cloudStorageUtils.uploadFile(
                            BUCKETS.FCH,
                            SharedUtils.jsonToCsv(failedRows),
                            `${FCH_BUCKET_FOLDERS.FACILITIES}/${file.facilityId}/${file.repository}/${file.fileId}-ef.${file.fileExtension}`
                        );
                    }
                } catch (error) {
                    ErrorLog(error, {
                        prefixMessage: `${AppErrorMessage.BULK_ADD_INVENTORY.PROCESS}${AppErrorMessage.BULK_ADD_INVENTORY.ADD_INVENTORY}`
                    });
                }
            });
        } catch (error) {
            ErrorLog(error, {
                prefixMessage: `${AppErrorMessage.BULK_ADD_INVENTORY.PROCESS}${AppErrorMessage.GET_FILES}`
            });
        }
    }

    async deactivateExpiredInventory() {
        try {
            const searchFilters = InventoryFilter.setFilter({pastExpiry: true});
            await this.update(searchFilters, InventoryEntity.create({isActive: false}));
        } catch (error) {
            ErrorLog(error, {
                prefixMessage: `${AppErrorMessage.DEACTIVATE_EXPIRED_INVENTORY.PROCESS}${AppErrorMessage.DEACTIVATE_EXPIRED_INVENTORY.DEACTIVATE_EXPIRED_INVENTORY}`
            });
        }
    }
}
