import {inject, injectable} from "tsyringe";

import {AdminEntity} from "@entities/Admin/AdminEntity";
import {CentralSupplyLogEntity} from "@entities/CentralSupplyLog/CentralSupplyLogEntity";
import {FormularyEntity} from "@entities/Formulary/FormularyEntity";
import {FormularyLevelEntity} from "@entities/FormularyLevel/FormularyLevelEntity";

import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddCentralSupplyLogDto} from "./Dtos/AddCentralSupplyLogDto";
import type {DownloadCentralSupplyLogDto} from "./Dtos/DownloadCentralSupplyLogDto";
import type {GetCentralSupplyDrugsDto} from "./Dtos/GetCentralSupplyDrugsDto";
import type {GetCentralSupplyLogDto} from "./Dtos/GetCentralSupplyLogDto";
import type {GetMinMaxOrderedQuantityDto} from "./Dtos/GetMinMaxOrderedQuantity";
import type {CentralSupplyLogDrugService} from "@application/CentralSupplyLogDrug/CentralSupplyLogDrugService";
import type {FormularyService} from "@application/Formulary/FormularyService";
import type {FormularyLevelService} from "@application/FormularyLevel/FormularyLevelService";
import type {InventoryService} from "@application/Inventory/InventoryService";
import type {ICentralSupplyLogRepository} from "@entities/CentralSupplyLog/ICentralSupplyLogRepository";
import type {CentralSupplyLog} from "@infrastructure/Database/Models/CentralSupplyLog";
import type {Formulary} from "@infrastructure/Database/Models/Formulary";
import type {FormularyLevel} from "@infrastructure/Database/Models/FormularyLevel";
import type {PaginationDto} from "@infraUtils/PaginationDto";
import type {TFilterCentralSupplyLog} from "@repositories/Shared/Query/CentralSupplyLogQueryBuilder";

@injectable()
export class CentralSupplyLogService extends BaseService<CentralSupplyLog, CentralSupplyLogEntity> {
    constructor(
        @inject("ICentralSupplyLogRepository") private centralSupplyLogRepository: ICentralSupplyLogRepository,
        @inject("ICentralSupplyLogDrugService") private centralSupplyLogDrugService: CentralSupplyLogDrugService,
        @inject("IFormularyService") private formularyService: FormularyService,
        @inject("IFormularyLevelService") private formularyLevelService: FormularyLevelService,
        @inject("IInventoryService") private inventoryService: InventoryService
    ) {
        super(centralSupplyLogRepository);
    }

    async fetchPaginatedBySearchQuery(searchFilters: TFilterCentralSupplyLog, pagination: PaginationOptions) {
        return this.centralSupplyLogRepository.fetchPaginatedBySearchQuery(searchFilters, pagination);
    }

    async fetchMinMaxOrderedQuantity() {
        return this.centralSupplyLogRepository.fetchMinMaxOrderedQuantity();
    }

    async fetchRunningMinMaxOrderedQuantity(facilityId: string) {
        return await this.centralSupplyLogRepository.fetchRunningMinMaxOrderedQuantity(facilityId);
    }

    currentFacilityFormularLevel(formularyLevel: FormularyLevel[], getCentralSupplyDrugsDto: GetCentralSupplyDrugsDto) {
        return formularyLevel.find((fl) => fl.facilityId === getCentralSupplyDrugsDto.facilityId)!;
    }

    calculateOrderedQuantity(formularyLevel: FormularyLevel, totalQuantity: number) {
        return formularyLevel.parLevel - totalQuantity - formularyLevel.orderedQuantity;
    }

    paginatedCentralSupplyDrugsEntity(
        centralSupplyDrugs: Formulary[],
        getCentralSupplyDrugsDto: GetCentralSupplyDrugsDto
    ) {
        return centralSupplyDrugs.map((csd) => {
            const formularyLevel = this.currentFacilityFormularLevel(csd.formularyLevel, getCentralSupplyDrugsDto);

            const totalQuantity = this.inventoryService.totalQuantity(csd, csd.inventory);

            return {
                formulary: {
                    ...FormularyEntity.publicFields(csd),
                    formularyLevel: FormularyLevelEntity.create(formularyLevel)
                },
                totalQuantity: totalQuantity,
                orderedQuantity: formularyLevel ? this.calculateOrderedQuantity(formularyLevel, totalQuantity) : null
            };
        });
    }

    async getCentralSupplyDrugs(getCentralSupplyDrugsDto: GetCentralSupplyDrugsDto, paginationDto: PaginationDto) {
        try {
            const pagination = PaginationOptions.create(paginationDto);

            const centralSupplyDrugs = await this.formularyService.fetchPaginatedWithLevelAndInventory(
                {...getCentralSupplyDrugsDto, isCentralSupply: true, isActiveInventory: true},
                pagination
            );
            if (!centralSupplyDrugs) {
                return HttpResponse.notFound();
            }

            const centralSupplyDrugsEntity = this.paginatedCentralSupplyDrugsEntity(
                centralSupplyDrugs.rows,
                getCentralSupplyDrugsDto
            );
            const paginatedData = PaginationData.getPaginatedData(
                pagination,
                centralSupplyDrugs.count,
                centralSupplyDrugsEntity
            );

            return HttpResponse.ok(paginatedData);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async downloadCentralSupplyLog(downloadCentralSupplyLogDto: DownloadCentralSupplyLogDto) {
        try {
            const centralSupplyDrugs = await this.formularyService.fetchAllWithLevelAndInventoryForCentralSupply({
                ...downloadCentralSupplyLogDto,
                isCentralSupply: true,
                isActiveInventory: true
            });
            if (!centralSupplyDrugs) {
                return HttpResponse.notFound();
            }

            const centralSupplyDrugsEntities = centralSupplyDrugs.map((csd) => {
                const formularyLevel = this.currentFacilityFormularLevel(csd.formularyLevel, {
                    ...downloadCentralSupplyLogDto
                });

                const totalQuantity = this.inventoryService.totalQuantity(csd, csd.inventory);

                return {
                    ...FormularyEntity.toCsv(csd),
                    totalQuantity: totalQuantity,
                    orderedQuantity: formularyLevel
                        ? this.calculateOrderedQuantity(formularyLevel, totalQuantity)
                        : null
                };
            });

            return HttpResponse.ok(centralSupplyDrugsEntities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async addCentralSupplyLog(addCentralSupplyLogDto: AddCentralSupplyLogDto, loggedInAdmin: AdminEntity) {
        try {
            const formularyIds = addCentralSupplyLogDto.rxOrder.map((rx) => rx.formularyId);
            const formularies = await this.formularyService.fetchAllForCentralSupply({
                formularyId: formularyIds,
                facilityId: addCentralSupplyLogDto.facilityId,
                isActiveInventory: true
            });
            if (!formularies) {
                return HttpResponse.notFound();
            }

            const centralSupplyLogEntity = CentralSupplyLogEntity.create(addCentralSupplyLogDto);
            centralSupplyLogEntity.adminId = loggedInAdmin.adminId;
            centralSupplyLogEntity.centralSupplyLogId = SharedUtils.shortUuid();

            await this.create(centralSupplyLogEntity);

            let totalOrderedQuantity = 0;

            for (const form of formularies) {
                const rxOrder = addCentralSupplyLogDto.rxOrder.find((rx) => rx.formularyId === form.formularyId);
                if (!rxOrder) {
                    continue;
                }

                const formularyLevel = form.formularyLevel.find(
                    (fl) => fl.facilityId === addCentralSupplyLogDto.facilityId
                );
                if (!formularyLevel) {
                    continue;
                }

                const totalQuantity = this.inventoryService.totalQuantity(form, form.inventory);

                await this.formularyLevelService.update(
                    {formularyLevelId: formularyLevel.formularyLevelId},
                    FormularyLevelEntity.create({
                        orderedQuantity: rxOrder.orderedQuantity + formularyLevel.orderedQuantity
                    })
                );

                totalOrderedQuantity += rxOrder.orderedQuantity;

                await this.centralSupplyLogDrugService.subAddCentralSupplyDrug({
                    centralSupplyLogId: centralSupplyLogEntity.centralSupplyLogId,
                    formularyId: form.formularyId,
                    orderedQuantity: rxOrder.orderedQuantity,
                    formularyQuantity: totalQuantity
                });
            }

            await this.update(
                {centralSupplyLogId: centralSupplyLogEntity.centralSupplyLogId},
                CentralSupplyLogEntity.create({orderedQuantity: totalOrderedQuantity})
            );

            return HttpResponse.ok({});
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    createCentralSupplyLogsEntities(centralSupplyLogs: CentralSupplyLog[]) {
        return centralSupplyLogs.map((csl) => ({
            centralSupplyLog: {
                ...CentralSupplyLogEntity.publicFields(csl),
                admin: AdminEntity.publicFields(csl.admin)
            }
        }));
    }

    async getCentralSupplyLogs(getCentralSupplyLogDto: GetCentralSupplyLogDto, paginationDto: PaginationDto) {
        try {
            const pagination = PaginationOptions.create(paginationDto);
            const centralSupplyLogs = await this.fetchPaginatedBySearchQuery(getCentralSupplyLogDto, pagination);
            if (!centralSupplyLogs) {
                return HttpResponse.notFound();
            }

            const centralSupplyLogsEntity = this.createCentralSupplyLogsEntities(centralSupplyLogs.rows);

            const paginatedData = PaginationData.getPaginatedData(
                pagination,
                centralSupplyLogs.count,
                centralSupplyLogsEntity
            );

            return HttpResponse.ok(paginatedData);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    mergeOrderedQuantities(
        orderedQuantity: {orderedQuantityMin: number; orderedQuantityMax: number},
        calculatedOrderedQuantity: {orderedQuantityMin: number; orderedQuantityMax: number} | undefined
    ) {
        return {
            orderedQuantityMin: orderedQuantity.orderedQuantityMin,
            orderedQuantityMax: orderedQuantity.orderedQuantityMax,
            calculatedOrderedQuantityMin: calculatedOrderedQuantity && calculatedOrderedQuantity.orderedQuantityMin,
            calculatedOrderedQuantityMax: calculatedOrderedQuantity && calculatedOrderedQuantity.orderedQuantityMax
        };
    }

    async getMinMaxOrderedQuantity(getMinMaxOrderedQuantityDto: GetMinMaxOrderedQuantityDto) {
        try {
            const orderedQuantity = await this.fetchMinMaxOrderedQuantity();
            const [calculatedOrderedQuantity] = await this.fetchRunningMinMaxOrderedQuantity(
                getMinMaxOrderedQuantityDto.facilityId
            );

            return HttpResponse.ok(this.mergeOrderedQuantities(orderedQuantity, calculatedOrderedQuantity));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
