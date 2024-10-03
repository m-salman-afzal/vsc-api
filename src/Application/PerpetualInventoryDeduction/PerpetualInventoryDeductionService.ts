import {inject, injectable} from "tsyringe";

import {DiscrepancyLogEntity} from "@entities/DiscrepancyLog/DiscrepancyLogEntity";
import {PerpetualInventoryEntity} from "@entities/PerpetualInventory/PerpetualInventoryEntity";
import {PerpetualInventoryDeductionEntity} from "@entities/PerpetualInventoryDeduction/PerpetualInventoryDeductionEntity";

import {BUCKETS, FCH_BUCKET_FOLDERS} from "@constants/CloudStorageConstant";
import {PERPETUAL_INVENTORY_FOLDERS} from "@constants/PerpetualInventoryConstant";
import {PERPETUAL_INVENTORY_DEDUCTION_TYPES} from "@constants/PerpetualInventoryDeductionConstant";

import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {
    cloudStorageUtils,
    discrepancyLogService,
    perpetualInventoryService
} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddPerpetualDeductionDto} from "./Dtos/AddPerpetualDeductionDto";
import type {RemovePerpetualInventoryDeductionDto} from "./Dtos/RemovePerpetualInventoryDeductionDto";
import type {UpdatePerpetualInventoryDeductionDto} from "./Dtos/UpdatePerpetualInventoryDeductionDto";
import type {IPerpetualInventoryDeductionRepository} from "@entities/PerpetualInventoryDeduction/IPerpetualInventoryDeductionRepository";
import type {PerpetualInventoryDeduction} from "@infrastructure/Database/Models/PerpetualInventoryDeduction";

@injectable()
export class PerpetualInventoryDeductionService extends BaseService<
    PerpetualInventoryDeduction,
    PerpetualInventoryDeductionEntity
> {
    constructor(
        @inject("IPerpetualInventoryDeductionRepository") private pidRepo: IPerpetualInventoryDeductionRepository
    ) {
        super(pidRepo);
    }

    async addPerpetualInventoryDeduction(addPerpetualDeductionDto: AddPerpetualDeductionDto) {
        try {
            const {perpetualInventoryEntity, patientName, providerName, type} = addPerpetualDeductionDto;
            const pidEntity = PerpetualInventoryDeductionEntity.create({
                ...addPerpetualDeductionDto,
                perpetualInventoryDeductionId: SharedUtils.shortUuid()
            });

            pidEntity.adminSignature = `adminSign-${pidEntity.perpetualInventoryDeductionId}.${SharedUtils.imageExtension(addPerpetualDeductionDto.signatureImages.adminSignature)}`;
            pidEntity.witnessSignature = `witnessSign-${pidEntity.perpetualInventoryDeductionId}.${SharedUtils.imageExtension(addPerpetualDeductionDto.signatureImages.witnessSignature)}`;

            if (type === PERPETUAL_INVENTORY_DEDUCTION_TYPES.DESTROYED) {
                pidEntity.nurseSignature = `nurseSign-${pidEntity.perpetualInventoryDeductionId}.${SharedUtils.imageExtension(addPerpetualDeductionDto.signatureImages.witnessSignature)}`;
            }

            if (!patientName || !providerName) {
                pidEntity.providerName = perpetualInventoryEntity.providerName;
                pidEntity.patientName = perpetualInventoryEntity.patientName;
            }

            await cloudStorageUtils.uploadFile(
                BUCKETS.FCH,
                SharedUtils.base64Decoder(
                    addPerpetualDeductionDto.signatureImages.adminSignature.split(";base64,")[1] as string
                ),
                `${FCH_BUCKET_FOLDERS.FACILITIES}/${perpetualInventoryEntity.facilityId}/${PERPETUAL_INVENTORY_FOLDERS.PERPETUAL_INVENTORY}/${PERPETUAL_INVENTORY_FOLDERS.PERPETUAL_INVENTORY_DEDUCTION}/${pidEntity.adminSignature}`
            );

            await cloudStorageUtils.uploadFile(
                BUCKETS.FCH,
                SharedUtils.base64Decoder(
                    addPerpetualDeductionDto.signatureImages.witnessSignature.split(";base64,")[1] as string
                ),
                `${FCH_BUCKET_FOLDERS.FACILITIES}/${perpetualInventoryEntity.facilityId}/${PERPETUAL_INVENTORY_FOLDERS.PERPETUAL_INVENTORY}/${PERPETUAL_INVENTORY_FOLDERS.PERPETUAL_INVENTORY_DEDUCTION}/${pidEntity.witnessSignature}`
            );

            if (type === PERPETUAL_INVENTORY_DEDUCTION_TYPES.DESTROYED) {
                await cloudStorageUtils.uploadFile(
                    BUCKETS.FCH,
                    SharedUtils.base64Decoder(
                        addPerpetualDeductionDto.signatureImages.nurseSignature.split(";base64,")[1] as string
                    ),
                    `${FCH_BUCKET_FOLDERS.FACILITIES}/${perpetualInventoryEntity.facilityId}/${PERPETUAL_INVENTORY_FOLDERS.PERPETUAL_INVENTORY}/${PERPETUAL_INVENTORY_FOLDERS.PERPETUAL_INVENTORY_DEDUCTION}/${pidEntity.nurseSignature}`
                );
            }

            return await this.pidRepo.create(pidEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async updatePerpetualInventoryDeduction(updatePerpetualDeductionDto: UpdatePerpetualInventoryDeductionDto) {
        try {
            const pid = await this.fetch({
                perpetualInventoryDeductionId: updatePerpetualDeductionDto.perpetualInventoryDeductionId
            });
            if (!pid) {
                return HttpResponse.notFound();
            }

            const pi = await perpetualInventoryService.fetch({perpetualInventoryId: pid.perpetualInventoryId});
            if (!pi) {
                return HttpResponse.notFound();
            }

            const tempQuantity = pi.quantityAllocated + pid.quantityDeducted;

            const newQuantityAllocated = tempQuantity - updatePerpetualDeductionDto.quantityDeducted;

            await perpetualInventoryService.update(
                {perpetualInventoryId: pi.perpetualInventoryId},
                PerpetualInventoryEntity.create({
                    quantityAllocated: newQuantityAllocated
                })
            );

            const pidEntity = PerpetualInventoryDeductionEntity.create({
                ...pid,
                date: updatePerpetualDeductionDto.date,
                time: updatePerpetualDeductionDto.time,
                providerName: updatePerpetualDeductionDto.providerName,
                patientName: updatePerpetualDeductionDto.patientName,
                quantityDeducted: updatePerpetualDeductionDto.quantityDeducted
            });
            await this.update({perpetualInventoryDeductionId: pid.perpetualInventoryDeductionId}, pidEntity);

            await discrepancyLogService.create(
                DiscrepancyLogEntity.create({
                    discrepancyLogId: SharedUtils.shortUuid(),
                    ...updatePerpetualDeductionDto,
                    cartId: pi.cartId,
                    quantityAllocated: newQuantityAllocated
                })
            );

            return HttpResponse.ok(pidEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async removePerpetualInventoryDeduction(removePerpetualDeductionDto: RemovePerpetualInventoryDeductionDto) {
        try {
            const pid = await this.fetch({
                perpetualInventoryDeductionId: removePerpetualDeductionDto.perpetualInventoryDeductionId
            });
            if (!pid) {
                return HttpResponse.notFound();
            }

            const pi = await perpetualInventoryService.fetch({perpetualInventoryId: pid.perpetualInventoryId});
            if (!pi) {
                return HttpResponse.notFound();
            }

            await perpetualInventoryService.update(
                {perpetualInventoryId: pi.perpetualInventoryId},
                PerpetualInventoryEntity.create({
                    quantityAllocated: pi.quantityAllocated + pid.quantityDeducted
                })
            );

            await this.remove({perpetualInventoryDeductionId: pid.perpetualInventoryDeductionId});

            await discrepancyLogService.create(
                DiscrepancyLogEntity.create({
                    discrepancyLogId: SharedUtils.shortUuid(),
                    ...removePerpetualDeductionDto,
                    cartId: pi.cartId,
                    quantityDeducted: pid.quantityDeducted,
                    quantityAllocated: pi.quantityAllocated
                })
            );

            return HttpResponse.ok(pid);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
