import {inject, injectable} from "tsyringe";

import {AdminEntity} from "@entities/Admin/AdminEntity";
import {CartEntity} from "@entities/Cart/CartEntity";
import {DiscrepancyLogEntity} from "@entities/DiscrepancyLog/DiscrepancyLogEntity";
import {PerpetualInventoryEntity} from "@entities/PerpetualInventory/PerpetualInventoryEntity";
import {PerpetualInventoryDeductionEntity} from "@entities/PerpetualInventoryDeduction/PerpetualInventoryDeductionEntity";

import {DISCREPENCY_LOG_TYPES} from "@constants/DiscrepencyLogConstant";

import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddDiscrepancyDto} from "./Dto/addDiscrepancyLogDto";
import type {GetDiscrepancyLogDto} from "./Dtos/GetDiscrepancyLog";
import type {IDiscrepancyLogRepository} from "@entities/DiscrepancyLog/IDiscrepancyLogRepository";
import type {DiscrepancyLog} from "@infrastructure/Database/Models/DiscrepancyLog";
import type {PaginationDto} from "@infraUtils/PaginationDto";
import type {TFilterDiscrepancyLog} from "@repositories/Shared/Query/DiscrepancyLogQueryBuilder";

@injectable()
export class DiscrepancyLogService extends BaseService<DiscrepancyLog, DiscrepancyLogEntity> {
    constructor(@inject("IDiscrepancyLogRepository") private discrepancyLogRepository: IDiscrepancyLogRepository) {
        super(discrepancyLogRepository);
    }

    async fetchPaginatedBySearchQuery(searchFilters: TFilterDiscrepancyLog, pagination: PaginationOptions) {
        return this.discrepancyLogRepository.fetchPaginatedBySearchQuery(searchFilters, pagination);
    }

    async getDiscrepanceyLogs(getDisrepancyLogDto: GetDiscrepancyLogDto, paginationDto: PaginationDto) {
        try {
            const pagination = PaginationOptions.create(paginationDto);
            const discrepancyLogs = await this.fetchPaginatedBySearchQuery(getDisrepancyLogDto, pagination);
            if (!discrepancyLogs) {
                return HttpResponse.notFound();
            }

            const discrepancyLogEntity = discrepancyLogs.rows.map((dl) => ({
                ...DiscrepancyLogEntity.publicFields(dl),
                perpetualInventory: dl.perpetualInventory
                    ? PerpetualInventoryEntity.create(dl.perpetualInventory)
                    : null,
                perpetualInventoryDeduction: dl.perpetualInventoryDeduction
                    ? {
                          ...PerpetualInventoryDeductionEntity.create(dl.perpetualInventoryDeduction),
                          perpetualInventory: PerpetualInventoryEntity.create(
                              dl.perpetualInventoryDeduction.perpetualInventory
                          )
                      }
                    : null,
                cart: CartEntity.create(dl.cart),
                admin: AdminEntity.publicFields(dl.admin)
            }));

            const paginatedData = PaginationData.getPaginatedData(
                pagination,
                discrepancyLogs.count,
                discrepancyLogEntity
            );

            return HttpResponse.ok(paginatedData);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async bulkAddDiscrepancies(addDiscrepancyDto: AddDiscrepancyDto[]) {
        try {
            const discrepancyLogEntities = addDiscrepancyDto.map((dto) => {
                const discrepancyLogEntity = DiscrepancyLogEntity.create({
                    ...dto,
                    type: DISCREPENCY_LOG_TYPES.SHIFT_COUNT_LOG,
                    discrepancyLogId: SharedUtils.shortUuid()
                });

                return discrepancyLogEntity;
            });

            const discrepancyCreated = await this.bulkInsert(discrepancyLogEntities);

            if (discrepancyCreated) {
                return true;
            }

            return false;
        } catch (error) {
            return Error(error as string);
        }
    }
}
