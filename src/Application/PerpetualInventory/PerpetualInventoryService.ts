import async from "async";
import {inject, injectable} from "tsyringe";

import {AdminEntity} from "@entities/Admin/AdminEntity";
import {CartEntity} from "@entities/Cart/CartEntity";
import {ControlledDrugEntity} from "@entities/ControlledDrug/ControlledDrugEntity";
import {DiscrepancyLogEntity} from "@entities/DiscrepancyLog/DiscrepancyLogEntity";
import {PerpetualInventoryEntity} from "@entities/PerpetualInventory/PerpetualInventoryEntity";
import {PerpetualInventoryDeductionEntity} from "@entities/PerpetualInventoryDeduction/PerpetualInventoryDeductionEntity";

import {BUCKETS, FCH_BUCKET_FOLDERS} from "@constants/CloudStorageConstant";
import {
    MAX_ROW_NUMBER,
    PERPETUAL_INVENTORY_FOLDERS,
    PERPETUAL_SIGNATURE_TYPES
} from "@constants/PerpetualInventoryConstant";
import {PERPETUAL_INVENTORY_DEDUCTION_TYPES} from "@constants/PerpetualInventoryDeductionConstant";

import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";
import {AddPerpetualDeductionDto} from "@application/PerpetualInventoryDeduction/Dtos/AddPerpetualDeductionDto";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {
    cartRequestDeductionService,
    cloudStorageUtils,
    controlledDrugService,
    discrepancyLogService,
    perpetualInventoryDeductionService
} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import {AddPerpetualInventoryDto} from "./Dtos/AddPerpetualInventoryDto";

import type {AddPerpetualInventoryDeductionDto} from "./Dtos/AddPerpetualInventoryDeductionDto";
import type {AddStaffSignatureDto} from "./Dtos/AddStaffSignatureDto";
import type {GetAllPerpetualInventoryDto} from "./Dtos/GetAllPerpetualInventoryDto";
import type {GetCartsDto} from "./Dtos/GetCartsDto";
import type {GetPerpetualInventoryDto} from "./Dtos/GetPerpetualInventoryDto";
import type {GetPerpetualInventorySignatureDto} from "./Dtos/GetPerpetualInventoryStaffSignatureDto";
import type {RemovePerpetualInventoryDto} from "./Dtos/RemovePerpetualInventoryDto";
import type {RevertPerpetualInventoryDto} from "./Dtos/RevertPerpetualInventoryDto";
import type {UnarchivePerpetualInventoryDto} from "./Dtos/UnarchivePerpetualInventory";
import type {UpdatePerpetualInventoryDto} from "./Dtos/UpdatePerpetualInventoryDto";
import type {IPerpetualInventoryRepository} from "@entities/PerpetualInventory/IPerpetualInventoryRepository";
import type {PerpetualInventory} from "@infrastructure/Database/Models/PerpetualInventory";
import type {PaginationDto} from "@infraUtils/PaginationDto";
import type {TFilterPerpetualInventory} from "@repositories/Shared/Query/PerpetualInventoryQueryBuilder";

@injectable()
export class PerpetualInventoryService extends BaseService<PerpetualInventory, PerpetualInventoryEntity> {
    constructor(@inject("IPerpetualInventoryRepository") private perpetualRepo: IPerpetualInventoryRepository) {
        super(perpetualRepo);
    }

    async addPerpetualInventory(addPerpetualInventoryDto: AddPerpetualInventoryDto) {
        try {
            const latestPI = await this.perpetualRepo.fetchLastest();

            let rowNumber = 1;

            if (latestPI) {
                if (latestPI.rowNumber < MAX_ROW_NUMBER) {
                    rowNumber = latestPI.rowNumber + 1;
                }
            }

            const perpetualEntity = PerpetualInventoryEntity.create({
                ...addPerpetualInventoryDto,
                rowNumber,
                perpetualInventoryId: SharedUtils.shortUuid(),
                isArchived: false
            });

            return await this.perpetualRepo.create(perpetualEntity);
        } catch (error) {
            return ErrorLog(error);
        }
    }

    async revertPerpetualInventory(revertPerpetualInventoryDto: RevertPerpetualInventoryDto) {
        try {
            const toRemove = await this.fetch({
                cartRequestDeductionId: revertPerpetualInventoryDto.cartRequestDeductionId
            });
            if (!toRemove || toRemove.isModified) {
                return;
            }
            await this.remove({perpetualInventoryId: toRemove.perpetualInventoryId});
        } catch (err) {
            ErrorLog(err);
        }
    }

    async subUpdatePerpetualInventory(updatePerpetualInventoryDto: UpdatePerpetualInventoryDto) {
        const searchFilters = {perpetualInventoryId: updatePerpetualInventoryDto.perpetualInventoryId};
        const isPerpetualInventory = await this.fetch(searchFilters);
        if (!isPerpetualInventory) {
            return false;
        }

        const controlledDrugSearchFilters = {controlledDrugId: isPerpetualInventory.controlledDrugId};
        const controlledDrug = await controlledDrugService.fetch(controlledDrugSearchFilters);
        if (controlledDrug) {
            const controlledDrugEntity = ControlledDrugEntity.create({
                ...controlledDrug,
                ...updatePerpetualInventoryDto
            });
            await controlledDrugService.update(controlledDrugSearchFilters, controlledDrugEntity);
        }

        const perpetualInventoryEntity = PerpetualInventoryEntity.create({
            ...isPerpetualInventory,
            ...updatePerpetualInventoryDto
        });
        await this.update(searchFilters, perpetualInventoryEntity);

        const controlledIdSearchFilters = {controlledDrugId: isPerpetualInventory.controlledDrugId};
        const perpetualInventories = await this.fetchAll(controlledIdSearchFilters, {});
        if (perpetualInventories) {
            await async.eachSeries(perpetualInventories, async (pI) => {
                try {
                    const pIE = PerpetualInventoryEntity.create({
                        ...pI,
                        controlledId: updatePerpetualInventoryDto.controlledId,
                        tr: updatePerpetualInventoryDto.tr as string,
                        rx: updatePerpetualInventoryDto.rx as string,
                        providerName: updatePerpetualInventoryDto.providerName,
                        patientName: updatePerpetualInventoryDto.patientName
                    });

                    await this.update({perpetualInventoryId: pIE.perpetualInventoryId}, pIE);
                } catch (error) {
                    await ErrorLog(error);
                }
            });
        }

        const discrepancyLogEntity = DiscrepancyLogEntity.create({
            ...isPerpetualInventory,
            ...updatePerpetualInventoryDto,
            type: "EDIT",
            level: 1
        });
        discrepancyLogEntity.discrepancyLogId = SharedUtils.shortUuid();
        await discrepancyLogService.create(discrepancyLogEntity);

        return perpetualInventoryEntity;
    }

    async updateSinglePerpetualInventory(perpetualInventory: PerpetualInventoryEntity) {
        await this.update({perpetualInventoryId: perpetualInventory.perpetualInventoryId}, perpetualInventory);
    }

    async transferPerpetualInventory(addPerpetualInventoryDeductionDto: AddPerpetualInventoryDeductionDto) {
        const searchFilters = {
            cartId: addPerpetualInventoryDeductionDto.cartId,
            controlledId: (addPerpetualInventoryDeductionDto.perpetualInventory as AddPerpetualInventoryDto)
                .controlledId
        };
        const isPerpetualInventoryInNewCart = await this.fetch(searchFilters);
        if (!isPerpetualInventoryInNewCart) {
            return await this.addPerpetualInventory(
                AddPerpetualInventoryDto.create({
                    ...addPerpetualInventoryDeductionDto.perpetualInventory,
                    cartId: addPerpetualInventoryDeductionDto.cartId,
                    quantityAllocated: addPerpetualInventoryDeductionDto.quantityDeducted
                })
            );
        }

        const perpetualInventoryEntity = PerpetualInventoryEntity.create({
            ...isPerpetualInventoryInNewCart,
            quantityAllocated:
                addPerpetualInventoryDeductionDto.quantityDeducted + isPerpetualInventoryInNewCart.quantityAllocated
        });

        return await this.update(
            {perpetualInventoryId: perpetualInventoryEntity.perpetualInventoryId},
            perpetualInventoryEntity
        );
    }

    async updatePerpetualInventory(updatePerpetualInventoryDto: UpdatePerpetualInventoryDto) {
        try {
            const isPerpetualInventoryUpdated = await this.subUpdatePerpetualInventory(updatePerpetualInventoryDto);
            if (!isPerpetualInventoryUpdated) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok(PerpetualInventoryEntity.create(isPerpetualInventoryUpdated));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async addStaffSignature(addStaffSignatureDto: AddStaffSignatureDto) {
        try {
            const pi = await this.fetch({perpetualInventoryId: addStaffSignatureDto.perpetualInventoryId});
            if (!pi) {
                return HttpResponse.notFound();
            }

            const perpetualInventoryEntity = PerpetualInventoryEntity.create(pi);

            perpetualInventoryEntity.staffName = addStaffSignatureDto.staffName;
            perpetualInventoryEntity.staffSignature = `staffSign-${perpetualInventoryEntity.perpetualInventoryId}.${SharedUtils.imageExtension(addStaffSignatureDto.staffSignature)}`;

            await cloudStorageUtils.uploadFile(
                BUCKETS.FCH,
                SharedUtils.base64Decoder(addStaffSignatureDto.staffSignature.split(";base64,")[1] as string),
                `${FCH_BUCKET_FOLDERS.FACILITIES}/${perpetualInventoryEntity.facilityId}/${PERPETUAL_INVENTORY_FOLDERS.PERPETUAL_INVENTORY}/${perpetualInventoryEntity.staffSignature}`
            );

            await this.update({perpetualInventoryId: pi.perpetualInventoryId}, perpetualInventoryEntity);

            return HttpResponse.created(perpetualInventoryEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async addPerpetualInventoryDeduction(addPerpetualInventoryDeductionDto: AddPerpetualInventoryDeductionDto) {
        try {
            const {perpetualInventoryId, quantityDeducted} = addPerpetualInventoryDeductionDto;
            const pi = await this.fetch({perpetualInventoryId});
            if (!pi) {
                return HttpResponse.notFound();
            }

            if (quantityDeducted > pi.quantityAllocated) {
                return HttpResponse.error({message: "Deduction quantity is greater than Qty OH"});
            }

            const quantityLeft = pi.quantityAllocated - quantityDeducted;
            const perpetualInventoryEntity = PerpetualInventoryEntity.create({
                ...pi,
                quantityAllocated: quantityLeft,
                isModified: true,
                isArchived: !(quantityLeft > 0)
            });

            perpetualInventoryEntity.cartRequestDeductionId &&
                (await cartRequestDeductionService.remove({
                    cartRequestDeductionId: perpetualInventoryEntity.cartRequestDeductionId
                }));

            const pid = await perpetualInventoryDeductionService.addPerpetualInventoryDeduction(
                AddPerpetualDeductionDto.create({...addPerpetualInventoryDeductionDto, perpetualInventoryEntity})
            );

            if (addPerpetualInventoryDeductionDto.type === PERPETUAL_INVENTORY_DEDUCTION_TYPES.TRANSFERRED) {
                perpetualInventoryEntity.cartRequestDeductionId = undefined as never;
            }

            await this.update({perpetualInventoryId}, perpetualInventoryEntity);

            perpetualInventoryEntity.perpetualInventoryDeduction = [pid] as PerpetualInventoryDeductionEntity[];

            if (addPerpetualInventoryDeductionDto.type === PERPETUAL_INVENTORY_DEDUCTION_TYPES.TRANSFERRED) {
                await this.transferPerpetualInventory({
                    ...addPerpetualInventoryDeductionDto,
                    perpetualInventory: perpetualInventoryEntity
                });
            }

            return HttpResponse.created(perpetualInventoryEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getPerpetualInventorySignature(getPerpetualInventorySignatureDto: GetPerpetualInventorySignatureDto) {
        try {
            const {perpetualInventoryId, perpetualInventoryDeductionId, signatureType, facilityId} =
                getPerpetualInventorySignatureDto;
            if (perpetualInventoryId) {
                const pi = await this.fetch({
                    perpetualInventoryId: getPerpetualInventorySignatureDto.perpetualInventoryId
                });
                if (!pi) {
                    return HttpResponse.notFound();
                }

                const signatureUrl = await cloudStorageUtils.generateV4ReadSignedUrl(
                    BUCKETS.FCH,
                    `${FCH_BUCKET_FOLDERS.FACILITIES}/${pi.facilityId}/${PERPETUAL_INVENTORY_FOLDERS.PERPETUAL_INVENTORY}/${pi.staffSignature}`
                );

                return HttpResponse.ok({signatureUrl, name: pi.staffName});
            }
            if (perpetualInventoryDeductionId && signatureType) {
                const pid = await perpetualInventoryDeductionService.fetch({
                    perpetualInventoryDeductionId
                });

                if (!pid) {
                    return HttpResponse.notFound();
                }

                const isWitness = signatureType === PERPETUAL_SIGNATURE_TYPES.WITNESS_SIGNATURE;

                const signatureUrl = await cloudStorageUtils.generateV4ReadSignedUrl(
                    BUCKETS.FCH,
                    `${FCH_BUCKET_FOLDERS.FACILITIES}/${facilityId}/${PERPETUAL_INVENTORY_FOLDERS.PERPETUAL_INVENTORY}/${PERPETUAL_INVENTORY_FOLDERS.PERPETUAL_INVENTORY_DEDUCTION}/${isWitness ? pid.witnessSignature : pid.adminSignature}`
                );

                return HttpResponse.ok({signatureUrl, name: isWitness ? pid.witnessName : pid.adminName});
            }

            return HttpResponse.notFound();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getCarts(getCartsDto: GetCartsDto) {
        try {
            const carts = await this.perpetualRepo.fetchCarts(getCartsDto as TFilterPerpetualInventory);
            if (!carts) {
                return HttpResponse.notFound();
            }
            const cartEntities = carts.map(CartEntity.create);

            return HttpResponse.ok(cartEntities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    setDeductionType(type: string) {
        switch (type) {
            case PERPETUAL_INVENTORY_DEDUCTION_TYPES.DOSE_ADMINISTERED:
                return "doseAdministered";

            case PERPETUAL_INVENTORY_DEDUCTION_TYPES.WASTED:
                return "wasted";

            case PERPETUAL_INVENTORY_DEDUCTION_TYPES.DESTROYED:
                return "destroyed";

            case PERPETUAL_INVENTORY_DEDUCTION_TYPES.TRANSFERRED:
                return "transferred";

            case PERPETUAL_INVENTORY_DEDUCTION_TYPES.RETURNED_TO_PATIENT:
                return "returned";

            case PERPETUAL_INVENTORY_DEDUCTION_TYPES.RETURNED_TO_PROPERTY:
                return "returned";

            default:
                return "";
        }
    }

    async getAllPerpetualInventory(getAllPerpetualInventoryDto: GetAllPerpetualInventoryDto) {
        try {
            const pi = await this.perpetualRepo.fetchAllWithDeductions(getAllPerpetualInventoryDto);

            if (!pi) {
                return HttpResponse.notFound();
            }

            const processedRows: Record<string, unknown>[] = [];

            for (const row of pi) {
                if (row.perpetualInventoryId !== null) {
                    processedRows.push({
                        ...row,
                        adminBy:
                            row.adminLastName && row.adminFirstName
                                ? `${row.adminLastName}, ${row.adminFirstName}`
                                : null,
                        "tr/rx": row.isPatientSpecific ? row.rx : row.tr,
                        [this.setDeductionType(row.type)]: row.quantityDeducted
                    });
                }
            }

            return HttpResponse.ok(processedRows);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async unarchivePerpetualInventory(unarchivePerpetualInventoryDto: UnarchivePerpetualInventoryDto) {
        try {
            const {perpetualInventoryId} = unarchivePerpetualInventoryDto;
            const pi = this.fetch({perpetualInventoryId});
            if (!pi) {
                return HttpResponse.notFound();
            }
            await this.update({perpetualInventoryId}, {...PerpetualInventoryEntity.create(pi), isArchived: false});

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getPerpetualInventory(getPerpetualInventoryDto: GetPerpetualInventoryDto, paginationDto: PaginationDto) {
        try {
            const pagination = PaginationOptions.create(paginationDto);

            const inventories = await this.perpetualRepo.fetchPaginatedWithDeductions(
                getPerpetualInventoryDto,
                pagination
            );

            if (!inventories) {
                return HttpResponse.notFound();
            }

            const piEntities = inventories.rows.map((pi) => {
                const entity = {
                    ...PerpetualInventoryEntity.publicFields(pi)
                };

                entity.perpetualInventoryDeduction = pi.perpetualInventoryDeduction
                    ? pi.perpetualInventoryDeduction.map((pid) => {
                          return {
                              ...PerpetualInventoryDeductionEntity.publicFields(pid),
                              admin: AdminEntity.publicFields(pid.admin)
                          };
                      })
                    : [];

                return entity;
            });

            return HttpResponse.ok(PaginationData.getPaginatedData(pagination, inventories.count, piEntities));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subRemovePerpetualInventory(removePerpetualInventoryDto: RemovePerpetualInventoryDto) {
        const searchFilters = {perpetualInventoryId: removePerpetualInventoryDto.perpetualInventoryId as string};
        const isPerpetualInventory = await this.fetch(searchFilters);
        if (!isPerpetualInventory) {
            return false;
        }

        const perpetualInventoryDeductions = await perpetualInventoryDeductionService.fetchAll(searchFilters, {});
        if (perpetualInventoryDeductions) {
            await async.eachSeries(perpetualInventoryDeductions, async (pID) => {
                try {
                    const searchFilters = {perpetualInventoryDeductionId: pID.perpetualInventoryDeductionId};
                    await perpetualInventoryDeductionService.remove(searchFilters);
                } catch (error) {
                    await ErrorLog(error);
                }
            });
        }
        const discrepancyLogEntity = DiscrepancyLogEntity.create({
            ...isPerpetualInventory,
            ...removePerpetualInventoryDto,
            type: "DELETE",
            level: 1
        });
        discrepancyLogEntity.discrepancyLogId = SharedUtils.shortUuid();
        discrepancyLogEntity.quantityAllocated = isPerpetualInventory.quantityAllocated;
        await discrepancyLogService.create(discrepancyLogEntity);

        await this.remove(searchFilters);

        return true;
    }

    async removePerpetualInventory(removePerpetualInventoryDto: RemovePerpetualInventoryDto) {
        try {
            const isPerpetualInventory = await this.subRemovePerpetualInventory(removePerpetualInventoryDto);
            if (!isPerpetualInventory) {
                return HttpResponse.notFound();
            }

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
