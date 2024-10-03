import {inject, injectable} from "tsyringe";

import {InventoryControlEntity} from "@entities/InventoryControl/InventoryControlEntity";

import {BUCKETS} from "@constants/CloudStorageConstant";
import {REPOSITORIES} from "@constants/FileConstant";

import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {cloudStorageUtils} from "@infrastructure/DIContainer/Resolver";

import type {AddInventoryControlDto} from "./Dtos/AddInventoryControlDto";
import type {IInventoryControlRepository} from "@entities/InventoryControl/IInventoryControlRepository";
import type {InventoryControl} from "@infrastructure/Database/Models/InventoryControl";

@injectable()
export class InventoryControlService extends BaseService<InventoryControl, InventoryControlEntity> {
    constructor(@inject("IInventoryControlRepository") inventoryControlRepository: IInventoryControlRepository) {
        super(inventoryControlRepository);
    }

    async addInventoryControl(addInventoryControlDto: AddInventoryControlDto) {
        const inventoryControlEntity = InventoryControlEntity.create(addInventoryControlDto);
        inventoryControlEntity.inventoryControlId = SharedUtils.shortUuid();
        inventoryControlEntity.receiverSignature = `recSign-${inventoryControlEntity.inventoryControlId}.${SharedUtils.imageExtension(addInventoryControlDto.signature.receiverSignature)}`;
        inventoryControlEntity.witnessSignature = `witSign-${inventoryControlEntity.inventoryControlId}.${SharedUtils.imageExtension(addInventoryControlDto.signature.witnessSignature)}`;

        await cloudStorageUtils.uploadFile(
            BUCKETS.FCH,
            SharedUtils.base64Decoder(
                addInventoryControlDto.signature.receiverSignature.split(";base64,")[1] as string
            ),
            `${REPOSITORIES.INVENTORY_CONTROL}/${inventoryControlEntity.receiverSignature}`
        );

        await cloudStorageUtils.uploadFile(
            BUCKETS.FCH,
            SharedUtils.base64Decoder(addInventoryControlDto.signature.witnessSignature.split(";base64,")[1] as string),
            `${REPOSITORIES.INVENTORY_CONTROL}/${inventoryControlEntity.witnessSignature}`
        );

        return await this.create(inventoryControlEntity);
    }
}
