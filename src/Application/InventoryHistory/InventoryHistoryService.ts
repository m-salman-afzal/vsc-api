import {inject, injectable} from "tsyringe";

import {InventoryHistoryEntity} from "@entities/InventoryHistory/InventoryHistoryEntity";

import {BUCKETS, FCH_BUCKET_FOLDERS} from "@constants/CloudStorageConstant";
import {FILE_EXTENSIONS, REPOSITORIES} from "@constants/FileConstant";

import {ORDER_BY} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {InventoryHistoryFilter} from "@repositories/Shared/ORM/InventoryHistoryFilter";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {cloudStorageUtils} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {DownloadInventoryHistoryDto} from "./Dtos/DownloadInventoryHistoryDto";
import type {GetInventoryHistoryListDto} from "./Dtos/GetInventoryHistoryListDto";
import type {FormularyEntity} from "@entities/Formulary/FormularyEntity";
import type {InventoryEntity} from "@entities/Inventory/InventoryEntity";
import type {IInventoryHistoryRepository} from "@entities/InventoryHistory/IInventoryHistoryRepository";
import type {InventoryHistory} from "@infrastructure/Database/Models/InventoryHistory";
import type {PaginationDto} from "@infraUtils/PaginationDto";

@injectable()
export class InventoryHistoryService extends BaseService<InventoryHistory, InventoryHistoryEntity> {
    constructor(@inject("IInventoryHistoryRepository") inventoryHistoryRepository: IInventoryHistoryRepository) {
        super(inventoryHistoryRepository);
    }

    async getInventoryHistoryList(
        getInventoryHistoryListDto: GetInventoryHistoryListDto,
        paginationDto: PaginationDto
    ) {
        try {
            const paginationOptions = PaginationOptions.create(paginationDto);
            const searchFilters = InventoryHistoryFilter.setFilter(getInventoryHistoryListDto);
            const inventoryHistories = await this.fetchPaginated(searchFilters, {id: ORDER_BY.DESC}, paginationOptions);
            if (!inventoryHistories) {
                return HttpResponse.notFound();
            }

            const count = await this.count(searchFilters);
            const inventoryHistoryEntities = inventoryHistories.map((ih) => InventoryHistoryEntity.publicFields(ih));
            const paginatedEntities = PaginationData.getPaginatedData(
                paginationOptions,
                count,
                inventoryHistoryEntities
            );

            return HttpResponse.ok(paginatedEntities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    private isControlledAndNonControlled(downloadInventoryHistoryListDto: DownloadInventoryHistoryDto) {
        return !downloadInventoryHistoryListDto.isControlled;
    }

    async downloadInventoryHistory(downloadInventoryHistoryListDto: DownloadInventoryHistoryDto) {
        try {
            const inventoryHistory = await this.fetch({
                inventoryHistoryId: downloadInventoryHistoryListDto.inventoryHistoryId
            });
            if (!inventoryHistory) {
                return HttpResponse.notFound();
            }

            const csv = await cloudStorageUtils.getFileContent(
                BUCKETS.FCH,
                `${FCH_BUCKET_FOLDERS.FACILITIES}/${inventoryHistory.facilityId}/${REPOSITORIES.INVENTORY_HISTORY}/${inventoryHistory.inventoryHistoryId}.${FILE_EXTENSIONS.CSV}`
            );

            const inventory = SharedUtils.csvToJson<FormularyEntity & InventoryEntity>(csv).filter(
                (i) =>
                    downloadInventoryHistoryListDto.isControlled === i.isControlled ||
                    this.isControlledAndNonControlled(downloadInventoryHistoryListDto)
            );

            return HttpResponse.ok(inventory);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
