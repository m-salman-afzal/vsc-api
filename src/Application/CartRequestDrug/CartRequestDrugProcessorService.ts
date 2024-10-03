import async from "async";
import {injectable} from "tsyringe";
import {ZodError} from "zod";
import {fromZodError} from "zod-validation-error";

import {CartRequestDrugEntity} from "@entities/CartRequestDrug/CartRequestDrugEntity";
import {ControlledDrugEntity} from "@entities/ControlledDrug/ControlledDrugEntity";

import {CART_ALLOCATION_STATUS, CART_REQUEST_TYPE} from "@constants/CartRequestConstant";
import {BUCKETS, FCH_BUCKET_FOLDERS} from "@constants/CloudStorageConstant";
import {CART_REQUEST_PROCESSES, FILE_STATUSES, REPOSITORIES} from "@constants/FileConstant";
import {DRUG_CLASSES} from "@constants/FormularyConstant";

import {CartRequestDrugValidation} from "@validations/CartRequestDrugValidation";

import SharedUtils from "@appUtils/SharedUtils";

import {ControlledDrugFilter} from "@repositories/Shared/ORM/ControlledDrugFilter";

import {
    cartRequestLogService,
    cartService,
    cloudStorageUtils,
    controlledDrugService,
    fileService,
    formularyService,
    inventoryService,
    referenceGuideDrugService
} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

import {CartRequestDrugService} from "./CartRequestDrugService";
import {InitialAllocationDto} from "./Dtos/InitialAllocationDto";

@injectable()
export class CartRequestDrugProcessorService extends CartRequestDrugService {
    private async subInitialAllocation(
        transformedAllocations: InitialAllocationDto[],
        facilityId: string,
        allocation: InitialAllocationDto[],
        adminId: string
    ) {
        const failedRows: InitialAllocationDto[] = [];
        const addedCount = 0;
        const updatedCount = 0;
        const removedCount = 0;
        let failedCount = 0;
        const formularyIds: string[] = [];
        let totalUnits = 0;

        let processedNumber = -1;

        const cartRequestLogEntity = await cartRequestLogService.addCartRequestLog({
            type: CART_REQUEST_TYPE.INITIAL_ALLOCATION,
            facilityId: facilityId,
            adminId: adminId,
            canUndo: false
        });

        await async.eachSeries(transformedAllocations, async (alloc) => {
            try {
                processedNumber++;

                CartRequestDrugValidation.initialAllocationValidation(alloc);
                const {id, ...initialAllocaitonDto} = alloc;

                const formularyEntity = await formularyService.getSingleFormularyById({id: id});
                if (!formularyEntity) {
                    (allocation[processedNumber] as InitialAllocationDto).failedReason = "formulary not found";
                    failedRows.push(allocation[processedNumber] as InitialAllocationDto);
                    failedCount++;

                    return;
                }

                if (formularyEntity.name.toLowerCase().trim() !== initialAllocaitonDto.drug.toLowerCase().trim()) {
                    (allocation[processedNumber] as InitialAllocationDto).failedReason =
                        "drug name and id do not match";
                    failedRows.push(allocation[processedNumber] as InitialAllocationDto);
                    failedCount++;

                    return;
                }

                await async.eachSeries(initialAllocaitonDto.cart, async (cart) => {
                    const isCart = await cartService.fetch({cart: cart});
                    if (!isCart) {
                        (allocation[processedNumber] as InitialAllocationDto).failedReason = `Cart: ${cart} not found`;
                        failedRows.push(allocation[processedNumber] as InitialAllocationDto);
                        failedCount++;

                        return;
                    }

                    const isFormularyInReferenceGuide = await referenceGuideDrugService.fetch({
                        formularyId: formularyEntity.formularyId,
                        referenceGuideId: isCart.referenceGuideId
                    });
                    if (!isFormularyInReferenceGuide) {
                        (allocation[processedNumber] as InitialAllocationDto).failedReason =
                            `Drug not found in the reference guide of the cart: ${cart}`;
                        failedRows.push(allocation[processedNumber] as InitialAllocationDto);
                        failedCount++;

                        return;
                    }

                    if (isFormularyInReferenceGuide.max < initialAllocaitonDto.packageQuantity) {
                        (allocation[processedNumber] as InitialAllocationDto).failedReason =
                            "Package quantity is greater than max set in reference guide";
                        failedRows.push(allocation[processedNumber] as InitialAllocationDto);
                        failedCount++;

                        return;
                    }

                    if (formularyEntity.isControlled && !initialAllocaitonDto.controlledId) {
                        (allocation[processedNumber] as InitialAllocationDto).failedReason = "controlledId is required";
                        failedRows.push(allocation[processedNumber] as InitialAllocationDto);
                        failedCount++;

                        return;
                    } else if (!formularyEntity.isControlled && initialAllocaitonDto.controlledId) {
                        (allocation[processedNumber] as InitialAllocationDto).failedReason =
                            "controlledId is not required";
                        failedRows.push(allocation[processedNumber] as InitialAllocationDto);
                        failedCount++;

                        return;
                    }

                    const inventory = await inventoryService.fetchAll(
                        {
                            facilityId: facilityId,
                            formularyId: formularyEntity.formularyId,
                            isActive: true
                        },
                        {}
                    );
                    if (!inventory) {
                        (allocation[processedNumber] as InitialAllocationDto).failedReason =
                            "No active NDC found in inventory";
                        failedRows.push(allocation[processedNumber] as InitialAllocationDto);
                        failedCount++;

                        return;
                    }

                    if (formularyEntity.isControlled) {
                        const controlledDrugSearchFilters = ControlledDrugFilter.setFilter({
                            controlledId: initialAllocaitonDto.controlledId,
                            inventoryId: inventory.map((inv) => inv.inventoryId)
                        });

                        const controlledDrugs = await controlledDrugService.fetchAll(controlledDrugSearchFilters, {});

                        if (!controlledDrugs) {
                            (allocation[processedNumber] as InitialAllocationDto).failedReason =
                                "controlledId not found for this drug";
                            failedRows.push(allocation[processedNumber] as InitialAllocationDto);
                            failedCount++;

                            return;
                        }

                        if (
                            formularyEntity.drugClass !== DRUG_CLASSES.ARV &&
                            initialAllocaitonDto.controlledId &&
                            !initialAllocaitonDto.tr
                        ) {
                            (allocation[processedNumber] as InitialAllocationDto).failedReason =
                                "tr is required for this drug";
                            failedRows.push(allocation[processedNumber] as InitialAllocationDto);
                            failedCount++;

                            return;
                        }

                        if (
                            formularyEntity.drugClass === DRUG_CLASSES.ARV &&
                            initialAllocaitonDto.controlledId &&
                            initialAllocaitonDto.tr
                        ) {
                            (allocation[processedNumber] as InitialAllocationDto).failedReason = "tr is not required";
                            failedRows.push(allocation[processedNumber] as InitialAllocationDto);
                            failedCount++;

                            return;
                        }

                        const drugFound = controlledDrugs.find((drug) => {
                            if (formularyEntity.drugClass === DRUG_CLASSES.ARV) {
                                return drug.controlledId === initialAllocaitonDto.controlledId;
                            }

                            return drug.tr === initialAllocaitonDto.tr;
                        });

                        if (!drugFound && formularyEntity.drugClass !== DRUG_CLASSES.ARV) {
                            (allocation[processedNumber] as InitialAllocationDto).failedReason =
                                "tr and controlledId do not match";
                            failedRows.push(allocation[processedNumber] as InitialAllocationDto);
                            failedCount++;

                            return;
                        }

                        const controlledDrugEntity = ControlledDrugEntity.create(drugFound);

                        if (controlledDrugEntity.controlledQuantity === 0) {
                            (allocation[processedNumber] as InitialAllocationDto).failedReason =
                                "controlledId has no quantity left";
                            failedRows.push(allocation[processedNumber] as InitialAllocationDto);
                            failedCount++;

                            return;
                        }

                        if (
                            !initialAllocaitonDto.totalUnits &&
                            Math.trunc(formularyEntity.unitsPkg * initialAllocaitonDto.packageQuantity) >
                                controlledDrugEntity.controlledQuantity
                        ) {
                            (allocation[processedNumber] as InitialAllocationDto).failedReason =
                                "units provided are more than the quanitity of controlledId in inventory";
                            failedRows.push(allocation[processedNumber] as InitialAllocationDto);
                            failedCount++;
                        }

                        if (initialAllocaitonDto.totalUnits > controlledDrugEntity.controlledQuantity) {
                            (allocation[processedNumber] as InitialAllocationDto).failedReason =
                                "units provided are more than the quanitity of controlledId in inventory";
                            failedRows.push(allocation[processedNumber] as InitialAllocationDto);
                            failedCount++;
                        }
                    }

                    if (initialAllocaitonDto.packageQuantity >= 0 && initialAllocaitonDto.totalUnits >= 0) {
                        const isValueCorrect =
                            Math.trunc(initialAllocaitonDto.packageQuantity * formularyEntity.unitsPkg) ===
                            initialAllocaitonDto.totalUnits;
                        if (!isValueCorrect) {
                            (allocation[processedNumber] as InitialAllocationDto).failedReason =
                                "packageQuantity and totalUnits do not match";
                            failedRows.push(allocation[processedNumber] as InitialAllocationDto);
                            failedCount++;

                            return;
                        }
                    }

                    const createAllocationEntity = CartRequestDrugEntity.create({
                        cartRequestDrugId: SharedUtils.shortUuid(),
                        allocationStatus: CART_ALLOCATION_STATUS.FULFILLED,
                        cartRequestLogId: cartRequestLogEntity.cartRequestLogId,
                        allocatedAt: `${SharedUtils.getCurrentDate({})} ${SharedUtils.getCurrentTime({})}`,
                        allocatedByAdminId: adminId,
                        cartRequestAllocationLogId: cartRequestLogEntity.cartRequestLogId,
                        formularyId: formularyEntity.formularyId,
                        facilityId: facilityId,
                        controlledId: initialAllocaitonDto.controlledId,
                        cartId: isCart.cartId,
                        referenceGuideDrugId: isFormularyInReferenceGuide.referenceGuideDrugId,
                        tr: initialAllocaitonDto.tr,
                        packageQuantity:
                            initialAllocaitonDto.packageQuantity ??
                            Number((initialAllocaitonDto.totalUnits / formularyEntity.unitsPkg).toFixed()),
                        totalUnits: initialAllocaitonDto.totalUnits
                            ? initialAllocaitonDto.totalUnits
                            : initialAllocaitonDto.packageQuantity * formularyEntity.unitsPkg
                    });

                    await this.create(createAllocationEntity);
                    await inventoryService.cartRequestInventoryDeduction({
                        facilityId: facilityId,
                        formularyId: formularyEntity.formularyId,
                        tobeDeductedQuantity:
                            initialAllocaitonDto.totalUnits ??
                            initialAllocaitonDto.packageQuantity * formularyEntity.unitsPkg,
                        cartRequestDrugId: createAllocationEntity.cartRequestDrugId,
                        packageQuantity: initialAllocaitonDto.packageQuantity,
                        controlledId: initialAllocaitonDto.controlledId,
                        tr: initialAllocaitonDto.tr,
                        type: CART_REQUEST_TYPE.INITIAL_ALLOCATION
                    });

                    formularyIds.push(formularyEntity.formularyId);

                    if (initialAllocaitonDto.totalUnits) {
                        totalUnits += initialAllocaitonDto.totalUnits;
                    } else {
                        totalUnits += initialAllocaitonDto.packageQuantity * formularyEntity.unitsPkg;
                    }
                });
            } catch (error) {
                if (error instanceof ZodError) {
                    const errorMessage = fromZodError(error);
                    (allocation[processedNumber] as InitialAllocationDto).failedReason = errorMessage.toString();
                }

                failedRows.push(allocation[processedNumber] as InitialAllocationDto);
                failedCount++;
            }
        });

        return {
            failedRows: failedRows,
            addedCount: addedCount,
            updatedCount: updatedCount,
            removedCount: removedCount,
            failedCount: failedCount,
            drugCount: new Set(formularyIds).size,
            totalUnits: totalUnits
        };
    }

    async initialAllocation() {
        try {
            const files = await fileService.fetchBySearchQuery({
                status: FILE_STATUSES.RECEIVED,
                process: CART_REQUEST_PROCESSES.INITIAL_ALLOCATION,
                repository: REPOSITORIES.CART_REQUEST_LOG
            });
            if (!files) {
                return;
            }

            await async.eachSeries(files, async (file) => {
                try {
                    await fileService.updateFile({...file, status: FILE_STATUSES.QUEUED});

                    const csvString = await cloudStorageUtils.getFileContent(
                        BUCKETS.FCH,
                        `${FCH_BUCKET_FOLDERS.FACILITIES}/${file.facilityId}/${file.repository}/${file.fileId}.${file.fileExtension}`
                    );

                    const rows = SharedUtils.csvToJson<InitialAllocationDto>(csvString);
                    const transformedRows = SharedUtils.convertStringToPrimitives(
                        structuredClone(rows).map((r) => InitialAllocationDto.create(r)),
                        {
                            toNumberArray: ["id", "packageQuantity", "totalUnits"],
                            toArray: ["cart"]
                        }
                    );

                    const {failedRows, ...processedInfo} = await this.subInitialAllocation(
                        transformedRows,
                        file.facilityId,
                        rows,
                        file.adminId
                    );

                    file.isEf = failedRows.length > 0;
                    file.info = processedInfo;
                    file.status = SharedUtils.setFileStatus(failedRows.length, transformedRows.length);
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
                        prefixMessage: `${AppErrorMessage.INITIAL_ALLOCATION.PROCESS}${AppErrorMessage.INITIAL_ALLOCATION.ALLOCATE}`
                    });
                }
            });
        } catch (error) {
            ErrorLog(error, {
                prefixMessage: `${AppErrorMessage.INITIAL_ALLOCATION.PROCESS}${AppErrorMessage.GET_FILES}`
            });
        }
    }
}
