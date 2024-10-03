import {injectable} from "tsyringe";

import {CONTROLLED_TYPE} from "@constants/InventoryConstant";

import {ORDER_BY} from "@appUtils/Constants";

import BaseRepository from "@repositories/BaseRepository";

import {CartRequestDrug} from "@infrastructure/Database/Models/CartRequestDrug";
import {Formulary} from "@infrastructure/Database/Models/Formulary";
import {dataSource} from "@infrastructure/Database/mysqlConnection";

import {CartRequestDrugQueryBuilder} from "./Shared/Query/CartRequestDrugQueryBuilder";
import {
    FETCH_ALL_FORMULARY,
    FETCH_ALL_FORMULARY_INVENTORY_LEVEL,
    FETCH_ALL_PICKED_BY_ADMINS
} from "./Shared/Query/FieldsBuilder";
import {FormularyQueryBuilder} from "./Shared/Query/FormularyQueryBuilder";

import type {TFilterFormulary} from "./Shared/Query/FormularyQueryBuilder";
import type {FormularyEntity} from "@entities/Formulary/FormularyEntity";
import type {IFormularyRepository} from "@entities/Formulary/IFormularyRepository";
import type PaginationOptions from "@infraUtils/PaginationOptions";

@injectable()
export class FormularyRepository extends BaseRepository<Formulary, FormularyEntity> implements IFormularyRepository {
    constructor() {
        super(Formulary);
    }

    async fetchPaginatedWithLevelAndInventory(searchFilters: TFilterFormulary, pagination: PaginationOptions) {
        const query = this.model
            .createQueryBuilder("formulary")
            .leftJoinAndSelect(
                "formulary.inventory",
                "inventory",
                `inventory.facilityId = :facilityId
                ${searchFilters.isActiveInventory != null && searchFilters.isActiveInventoryForNdcStatus !== "none" ? `AND inventory.isActive = :isActive` : ""}`,
                {facilityId: searchFilters.facilityId, isActive: searchFilters.isActiveInventory}
            )
            .leftJoinAndSelect(
                "formulary.formularyLevel",
                "formularyLevel",
                "formularyLevel.facilityId = :facilityId",
                {
                    facilityId: searchFilters.facilityId
                }
            )
            .leftJoinAndSelect(
                "inventory.controlledDrug",
                "controlledDrug",
                `${searchFilters.fromInventory ? "" : `controlledDrug.controlledType = 'STOCK'`}`
            )
            .orderBy("formulary.name", "ASC");

        const countQuery = dataSource
            .createQueryBuilder()
            .select("COUNT(*)", "formularyCount")
            .from((subQuery) => {
                const cq = subQuery
                    .select("DISTINCT formulary.id", "id")
                    .from(Formulary, "formulary")
                    .leftJoin(
                        "formulary.inventory",
                        "inventory",
                        `inventory.deletedAt IS NULL AND inventory.facilityId = :facilityId
                        ${searchFilters.isActiveInventory ? `AND inventory.isActive = :isActive` : ""}`,
                        {facilityId: searchFilters.facilityId, isActive: searchFilters.isActiveInventory}
                    )
                    .leftJoin(
                        "formulary.formularyLevel",
                        "formularyLevel",
                        `formularyLevel.deletedAt IS NULL AND formularyLevel.facilityId = :facilityId`,
                        {
                            facilityId: searchFilters.facilityId
                        }
                    )
                    .leftJoin("inventory.controlledDrug", "controlledDrug")
                    .where("formulary.deletedAt IS NULL");

                const countFilters = FormularyQueryBuilder.setFilter(cq, {
                    ...searchFilters,
                    controlledType: CONTROLLED_TYPE.STOCK
                });

                return countFilters;
            }, "formularyCount");

        const queryFilters = FormularyQueryBuilder.setFilter(query, {
            ...searchFilters,
            controlledType: CONTROLLED_TYPE.STOCK
        });

        const rows = await queryFilters.take(pagination.perPage).skip(pagination.offset).getMany();
        const count = await countQuery.getRawOne();

        if (rows.length === 0) {
            return false;
        }

        return {count: Number(count.formularyCount), rows: rows};
    }

    async fetchAllWithInventory(searchFilters: TFilterFormulary) {
        const query = this.model
            .createQueryBuilder("formulary")
            .leftJoinAndSelect(
                "formulary.inventory",
                "inventory",
                `inventory.facilityId = :facilityId
                ${searchFilters.isActiveInventory != null ? `AND inventory.isActive = :isActive` : ""}`,
                {facilityId: searchFilters.facilityId, isActive: searchFilters.isActiveInventory}
            )
            .leftJoinAndSelect(
                "inventory.controlledDrug",
                "controlledDrug",
                `controlledDrug.controlledType = :controlledType`,
                {controlledType: CONTROLLED_TYPE.STOCK}
            )
            .orderBy("formulary.name", "ASC");

        const queryFilters = FormularyQueryBuilder.setFilter(query, {
            ...searchFilters,
            controlledType: CONTROLLED_TYPE.STOCK
        });

        const rows = await queryFilters.getMany();

        if (rows.length === 0) {
            return false;
        }

        return rows;
    }

    async fetchAllWithLevelAndInventory(searchFilters: TFilterFormulary) {
        const query = this.model
            .createQueryBuilder("formulary")
            .leftJoin("formulary.inventory", "inventory")
            .leftJoin("formulary.formularyLevel", "formularyLevel")
            .leftJoin("inventory.controlledDrug", "controlledDrug")
            .orderBy("formulary.name", "ASC");

        const queryFilters = FormularyQueryBuilder.setFilter(query, searchFilters);
        const rows = await queryFilters.select(FETCH_ALL_FORMULARY_INVENTORY_LEVEL).getRawMany();

        if (rows.length === 0) {
            return false;
        }

        return rows;
    }

    async fetchPaginatedForCartPick(searchFilters: TFilterFormulary, pagination: PaginationOptions) {
        const query = this.model
            .createQueryBuilder("formulary")
            .innerJoin(
                (subQuery) => {
                    const cq = subQuery
                        .select("cartRequestDrug.formularyId", "formularyId")
                        .addSelect("cartRequestDrug.allocationStatus", "allocationStatus")
                        .addSelect("cartRequestDrug.allocatedAt", "allocatedAt")
                        .addSelect("cartRequestDrug.pickedAt", "pickedAt")
                        .addSelect("SUM(`cartRequestDrug`.`packageQuantity`)", "totalPackageQuantities")
                        .addSelect(FETCH_ALL_PICKED_BY_ADMINS)
                        .from(CartRequestDrug, "cartRequestDrug")
                        .leftJoin("cartRequestDrug.pickedByAdmin", "pickedByAdmin")
                        .leftJoin("cartRequestDrug.cartRequestPickLog", "cartRequestPickLog")
                        .groupBy("cartRequestDrug.formularyId")
                        .addGroupBy("cartRequestDrug.allocationStatus")
                        .addGroupBy("cartRequestDrug.allocatedAt")
                        .addGroupBy("cartRequestDrug.pickedAt")
                        .addGroupBy("pickedByAdmin.adminId");

                    return CartRequestDrugQueryBuilder.setFilter(cq, {
                        pickStatus: searchFilters.pickStatus as string,
                        type: searchFilters.type as string,
                        facilityId: searchFilters.facilityId as string,
                        allocationStatus: searchFilters.allocationStatus as string
                    });
                },
                "cartRequestDrugs",
                "cartRequestDrugs.formularyId = formulary.formularyId"
            )
            .leftJoin(
                (subQuery) => {
                    const cq = subQuery
                        .select("formulary.formularyId", "formularyId")
                        .addSelect("SUM(`inventory`.`quantity`)", "sumNonControlledQuantity")
                        .addSelect("SUM(`inventory`.`isActive`)", "isActiveNonControlledQuantity")
                        .from(Formulary, "formulary")
                        .leftJoin("formulary.inventory", "inventory")
                        .where("formulary.isControlled = :nonControlled", {nonControlled: 0})
                        .groupBy("formulary.formularyId");

                    return cq;
                },
                "nonControlledDrugs",
                "nonControlledDrugs.formularyId = formulary.formularyId"
            )
            .leftJoin(
                (subQuery) => {
                    const cq = subQuery
                        .select("formulary.formularyId", "formularyId")
                        .addSelect("SUM(`controlledDrug`.`controlledQuantity`)", "sumControlledQuantity")
                        .addSelect("SUM(`inventory`.`isActive`)", "isActiveControlledQuantity")
                        .from(Formulary, "formulary")
                        .leftJoin("formulary.inventory", "inventory")
                        .leftJoin("inventory.controlledDrug", "controlledDrug")
                        .where("formulary.isControlled = :controlled", {controlled: 1})
                        .andWhere("controlledDrug.controlledType = :controlledType", {
                            controlledType: searchFilters.controlledType
                        })
                        .groupBy("formulary.formularyId");

                    return cq;
                },
                "controlledDrugs",
                "controlledDrugs.formularyId = formulary.formularyId"
            )
            .orderBy("isDrugFound")
            .addOrderBy("formulary.name", ORDER_BY.ASC)
            .limit(pagination.perPage)
            .offset(pagination.offset);

        const queryFilters = query
            .addSelect(FETCH_ALL_FORMULARY)
            .addSelect("cartRequestDrugs.totalPackageQuantities * formulary.unitsPkg AS totalUnits")
            .addSelect("nonControlledDrugs.sumNonControlledQuantity")
            .addSelect("controlledDrugs.sumControlledQuantity")
            .addSelect(
                "(IF(formulary.isControlled = 0, nonControlledDrugs.sumNonControlledQuantity, controlledDrugs.sumControlledQuantity) >= cartRequestDrugs.totalPackageQuantities * formulary.unitsPkg AND IF(formulary.isControlled = 0, nonControlledDrugs.isActiveNonControlledQuantity, controlledDrugs.isActiveControlledQuantity) > 0) AS isDrugFound"
            );

        FormularyQueryBuilder.setFilter(queryFilters, {
            name: searchFilters.name as string
        });

        const subResults = await queryFilters.getRawMany();

        const countQuery = this.model
            .createQueryBuilder("formulary")
            .leftJoinAndSelect("formulary.cartRequestDrug", "cartRequestDrug")
            .leftJoinAndSelect("cartRequestDrug.pickedByAdmin", "pickedByAdmin")
            .leftJoinAndSelect("cartRequestDrug.cartRequestPickLog", "cartRequestPickLog")
            .leftJoinAndSelect("formulary.inventory", "inventory")
            .leftJoinAndSelect("inventory.controlledDrug", "controlledDrug");

        const countFilters = FormularyQueryBuilder.setFilter(countQuery, searchFilters);

        const count = await countFilters.getCount();

        return {count: count, rows: subResults};
    }

    async fetchAllForCentralSupply(searchFilters: TFilterFormulary) {
        const query = this.model
            .createQueryBuilder("formulary")
            .leftJoinAndSelect(
                "formulary.formularyLevel",
                "formularyLevel",
                `formularyLevel.facilityId = :facilityId`,
                {
                    facilityId: searchFilters.facilityId
                }
            )
            .leftJoinAndSelect(
                "formulary.inventory",
                "inventory",
                `inventory.facilityId = :facilityId
                ${searchFilters.isActiveInventory != null ? `AND inventory.isActive = :isActive` : ""}`,
                {facilityId: searchFilters.facilityId, isActive: searchFilters.isActiveInventory}
            )
            .leftJoinAndSelect("inventory.controlledDrug", "controlledDrug");

        const queryFilters = FormularyQueryBuilder.setFilter(query, searchFilters);

        const rows = await queryFilters.getMany();

        if (rows.length === 0) {
            return false;
        }

        return rows;
    }

    async fetchAllWithLevelAndInventoryForCentralSupply(searchFilters: TFilterFormulary) {
        const query = this.model
            .createQueryBuilder("formulary")
            .leftJoinAndSelect(
                "formulary.inventory",
                "inventory",
                `inventory.facilityId = :facilityId
                ${searchFilters.isActiveInventory != null ? `AND inventory.isActive = :isActive` : ""}`,
                {facilityId: searchFilters.facilityId, isActive: searchFilters.isActiveInventory}
            )
            .leftJoinAndSelect(
                "formulary.formularyLevel",
                "formularyLevel",
                "formularyLevel.facilityId = :facilityId",
                {
                    facilityId: searchFilters.facilityId
                }
            )
            .leftJoinAndSelect(
                "inventory.controlledDrug",
                "controlledDrug",
                `controlledDrug.controlledType = :controlledType`,
                {controlledType: CONTROLLED_TYPE.STOCK}
            )
            .orderBy("formulary.name", "ASC");

        const queryFilters = FormularyQueryBuilder.setFilter(query, {
            ...searchFilters,
            controlledType: CONTROLLED_TYPE.STOCK
        });

        const rows = await queryFilters.getMany();

        if (rows.length === 0) {
            return false;
        }

        return rows;
    }
}
