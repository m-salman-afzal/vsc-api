import {injectable} from "tsyringe";

import {ORDER_BY} from "@appUtils/Constants";

import BaseRepository from "@repositories/BaseRepository";

import {CentralSupplyLog} from "@infrastructure/Database/Models/CentralSupplyLog";
import {dataSource} from "@infrastructure/Database/mysqlConnection";

import {CentralSupplyLogQueryBuilder} from "./Shared/Query/CentralSupplyLogQueryBuilder";

import type {TFilterCentralSupplyLog} from "./Shared/Query/CentralSupplyLogQueryBuilder";
import type {CentralSupplyLogEntity} from "@entities/CentralSupplyLog/CentralSupplyLogEntity";
import type {ICentralSupplyLogRepository} from "@entities/CentralSupplyLog/ICentralSupplyLogRepository";
import type PaginationOptions from "@infraUtils/PaginationOptions";

@injectable()
export class CentralSupplyLogRepository
    extends BaseRepository<CentralSupplyLog, CentralSupplyLogEntity>
    implements ICentralSupplyLogRepository
{
    constructor() {
        super(CentralSupplyLog);
    }

    async fetchPaginatedBySearchQuery(searchFilters: TFilterCentralSupplyLog, pagination: PaginationOptions) {
        const query = this.model
            .createQueryBuilder("centralSupplyLog")
            .leftJoinAndSelect("centralSupplyLog.admin", "admin")
            .orderBy("centralSupplyLog.createdAt", ORDER_BY.DESC)
            .take(pagination.perPage)
            .skip(pagination.offset);

        const countQuery = this.model
            .createQueryBuilder("centralSupplyLog")
            .leftJoinAndSelect("centralSupplyLog.admin", "admin")
            .take(pagination.perPage)
            .skip(pagination.offset);

        const queryFilters = CentralSupplyLogQueryBuilder.setFilter(query, searchFilters);
        const countFilters = CentralSupplyLogQueryBuilder.setFilter(countQuery, searchFilters);

        const rows = await queryFilters.getMany();
        const count = await countFilters.getCount();

        if (rows.length === 0) {
            return false;
        }

        return {count: count, rows: rows};
    }

    async fetchMinMaxOrderedQuantity() {
        const query = this.model
            .createQueryBuilder("centralSupplyLog")
            .select("MIN(centralSupplyLog.orderedQuantity)", "orderedQuantityMin")
            .addSelect("MAX(centralSupplyLog.orderedQuantity)", "orderedQuantityMax");

        const row = await query.getRawOne();

        return row;
    }

    async fetchRunningMinMaxOrderedQuantity(facilityId: string) {
        const totalQuantity = `IF(
                    formulary.isControlled = false, 
                    COALESCE(SUM(IF(inventory.isActive = false, 0, inventory.quantity)), 0), 
                    COALESCE(SUM(IF(inventory.isActive = false, 0, controlledDrug.controlledQuantity)), 0)
                    )`;

        const orderedQuantity = "COALESCE(formularyLevel.orderedQuantity, 0)";

        const centralSupply = dataSource
            .getRepository("Inventory")
            .createQueryBuilder("inventory")
            .select("inventory.formularyId")
            .addSelect(`${totalQuantity}`, "totalQuantity")
            .addSelect(`formularyLevel.parLevel - ${totalQuantity} - ${orderedQuantity}`, "calculatedOrderedQuantity")
            .leftJoin("inventory.formulary", "formulary")
            .leftJoin("formulary.formularyLevel", "formularyLevel", `formularyLevel.facilityId = '${facilityId}'`)
            .leftJoin("inventory.controlledDrug", "controlledDrug", "controlledDrug.controlledType = 'STOCK'")
            .where(`inventory.facilityId = '${facilityId}'`)
            .andWhere(`(formularyLevel.isStock = true OR formularyLevel.isStock IS NULL)`)
            .addGroupBy("inventory.formularyId")
            .addGroupBy("formularyLevel.orderedQuantity")
            .addGroupBy("formularyLevel.parLevel")
            .addGroupBy("formularyLevel.threshold")
            .having(
                `IF(totalQuantity < (formularyLevel.threshold + ${orderedQuantity}), calculatedOrderedQuantity, 0) > 0`
            );

        const query = await this.model.query(
            `
            WITH 
                centralSupply AS (${centralSupply.getQuery()}),
                orderedQuantityMinMaxValues AS (SELECT 
                                                    MIN(CS.calculatedOrderedQuantity) AS orderedQuantityMin,
                                                    MAX(CS.calculatedOrderedQuantity) AS orderedQuantityMax
                                                FROM centralSupply AS CS)

            SELECT 
                orderedQuantityMinMaxValues.orderedQuantityMin AS orderedQuantityMin,
                orderedQuantityMinMaxValues.orderedQuantityMax AS orderedQuantityMax
            FROM orderedQuantityMinMaxValues`
        );

        return query;
    }
}
