import {Brackets} from "typeorm";

import type {ILogEntity} from "@entities/Log/LogEntity";
import type Log from "@infrastructure/Database/Models/Log";
import type {TQueryBuilder} from "@src/typings/ORM";

type TFilterLog = Partial<ILogEntity> & {
    toDate?: string | undefined;
    fromDate?: string | undefined;
    text?: string | undefined;
};
type TQueryBuilderLog = TQueryBuilder<Log>;

class LogQueryBuilder {
    private query: TQueryBuilderLog;
    constructor(query: TQueryBuilderLog, filters: TFilterLog) {
        this.query = query;

        this.setMethod(filters);
        this.setAdminId(filters);
        this.setLogCreatedAt(filters);
        this.setLogText(filters);
    }

    static setFilter(query: TQueryBuilderLog, filters) {
        return new LogQueryBuilder(query, filters).query;
    }

    setMethod(filters: TFilterLog) {
        if (filters.method) {
            this.query.andWhere("log.method = :method", {method: filters.method});
        }
    }

    setAdminId(filters: TFilterLog) {
        if (filters.adminId) {
            this.query.andWhere("admin.adminId = :adminId", {adminId: filters.adminId});
        }
    }

    setLogCreatedAt(filters: TFilterLog) {
        if (filters.toDate && filters.fromDate) {
            this.query.andWhere("log.createdAt BETWEEN :fromDate AND :toDate", {
                fromDate: filters.fromDate,
                toDate: `${filters.fromDate} 23:59:59`
            });
        }
    }

    setLogText(filters: TFilterLog) {
        if (filters.text) {
            this.query.andWhere(
                new Brackets((qb) => {
                    qb.orWhere("log.logId = :text", {text: filters.text});
                    qb.orWhere("log.reqUrl LIKE :text", {text: `%${filters.text}%`});
                    qb.orWhere("log.payload LIKE :text", {text: `%${filters.text}%`});
                })
            );
        }
    }
}

export default LogQueryBuilder;
