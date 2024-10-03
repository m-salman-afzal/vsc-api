import async from "async";
import {injectable} from "tsyringe";

import {InventoryHistoryEntity} from "@entities/InventoryHistory/InventoryHistoryEntity";

import {BUCKETS, FCH_BUCKET_FOLDERS} from "@constants/CloudStorageConstant";
import {FILE_EXTENSIONS, REPOSITORIES} from "@constants/FileConstant";

import SharedUtils from "@appUtils/SharedUtils";

import {cloudStorageUtils, facilityService, inventoryService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

import {InventoryHistoryService} from "./InventoryHistoryService";

@injectable()
export class InventoryHistoryProcessorService extends InventoryHistoryService {
    private async uploadAllInventory(
        inventoryEntities: object[],
        facilityId: string,
        inventoryHistoryEntity: InventoryHistoryEntity
    ) {
        const csv = SharedUtils.jsonToCsv(inventoryEntities);
        await cloudStorageUtils.uploadFile(
            BUCKETS.FCH,
            csv,
            `${FCH_BUCKET_FOLDERS.FACILITIES}/${facilityId}/${REPOSITORIES.INVENTORY_HISTORY}/${inventoryHistoryEntity.inventoryHistoryId}.${FILE_EXTENSIONS.CSV}`
        );

        await this.create(inventoryHistoryEntity);
    }

    async uploadInventory() {
        try {
            const facilities = await facilityService.fetchAll({}, {});
            if (!facilities) {
                return;
            }

            await async.eachSeries(facilities, async (facility) => {
                try {
                    const allInventory = await inventoryService.subGetAllInventory({
                        facilityId: facility.facilityId,
                        pastExpiry: false
                    });
                    if (!allInventory) {
                        return;
                    }

                    const inventoryHistoryEntity = InventoryHistoryEntity.create({
                        inventoryHistoryId: SharedUtils.shortUuid(),
                        facilityId: facility.facilityId
                    });

                    await this.uploadAllInventory(allInventory, facility.facilityId, inventoryHistoryEntity);
                } catch (error) {
                    ErrorLog(error, {
                        prefixMessage: `${AppErrorMessage.UPLOAD_INVENTORY_HISTORY.PROCESS}${AppErrorMessage.UPLOAD_INVENTORY_HISTORY.FETCH_INVENTORY}`
                    });
                }
            });
        } catch (error) {
            ErrorLog(error, {
                prefixMessage: `${AppErrorMessage.UPLOAD_INVENTORY_HISTORY.PROCESS}${AppErrorMessage.UPLOAD_INVENTORY_HISTORY.UPLOAD_INVENTORY}`
            });
        }
    }
}
