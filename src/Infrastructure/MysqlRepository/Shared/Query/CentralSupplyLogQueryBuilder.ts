import {Brackets} from "typeorm";

import type {IAdminEntity} from "@entities/Admin/AdminEntity";
import type {ICentralSupplyLogEntity} from "@entities/CentralSupplyLog/CentralSupplyLogEntity";
import type {CentralSupplyLog} from "@infrastructure/Database/Models/CentralSupplyLog";
import type {TQueryBuilder} from "@typings/ORM";

export type TFilterCentralSupplyLog = Partial<
    ICentralSupplyLogEntity &
        IAdminEntity & {
            toDate: string;
            fromDate: string;
            orderedQuantityMin: number;
            orderedQuantityMax: number;
        }
>;

type TQueryBuilderCentralSupplyLog = TQueryBuilder<CentralSupplyLog>;

export class CentralSupplyLogQueryBuilder {
    private query: TQueryBuilderCentralSupplyLog;
    constructor(query: TQueryBuilderCentralSupplyLog, filters: TFilterCentralSupplyLog) {
        this.query = query;

        this.setCreatedAt(filters);
        this.setFirstName(filters);
        this.setLastName(filters);
        this.setOrderedQuantity(filters);
        this.setFacilityId(filters);
    }

    static setFilter(query: TQueryBuilderCentralSupplyLog, filters: TFilterCentralSupplyLog) {
        return new CentralSupplyLogQueryBuilder(query, filters).query;
    }

    setCreatedAt(filters: TFilterCentralSupplyLog) {
        if (filters.toDate && filters.fromDate) {
            this.query.andWhere("centralSupplyLog.createdAt BETWEEN :fromDate AND :toDate", {
                fromDate: filters.fromDate,
                toDate: `${filters.toDate} 23:59:59`
            });
        }
    }

    setFirstName(filters: TFilterCentralSupplyLog) {
        if (filters.firstName) {
            this.query.andWhere(
                new Brackets((qb) => {
                    qb.orWhere("admin.firstName LIKE :firstName", {firstName: `%${filters.firstName}%`});
                    qb.orWhere("admin.lastName LIKE :firstName", {firstName: `%${filters.firstName}%`});
                })
            );
        }
    }

    setLastName(filters: TFilterCentralSupplyLog) {
        if (filters.lastName) {
            this.query.andWhere(
                new Brackets((qb) => {
                    qb.orWhere("admin.lastName LIKE :lastName", {lastName: `%${filters.lastName}%`});
                    qb.orWhere("admin.firstName LIKE :lastName", {lastName: `%${filters.lastName}%`});
                })
            );
        }
    }

    setOrderedQuantity(filters: TFilterCentralSupplyLog) {
        if (filters.orderedQuantityMin && filters.orderedQuantityMax) {
            this.query.andWhere(
                "centralSupplyLog.orderedQuantity BETWEEN :orderedQuantityMin AND :orderedQuantityMax",
                {
                    orderedQuantityMin: filters.orderedQuantityMin,
                    orderedQuantityMax: filters.orderedQuantityMax
                }
            );
        }
    }

    setFacilityId(filters: TFilterCentralSupplyLog) {
        if (filters.facilityId) {
            this.query.andWhere("centralSupplyLog.facilityId = :facilityId", {facilityId: filters.facilityId});
        }
    }
}
