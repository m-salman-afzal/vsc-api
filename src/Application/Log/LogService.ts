import {inject, injectable} from "tsyringe";

import LogEntity from "@entities/Log/LogEntity";

import HttpResponse from "@appUtils/HttpResponse";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {ErrorLog} from "@logger/ErrorLog";

import type GetLogDTO from "./DTOs/GetLogDTO";
import type ILogRepository from "@entities/Log/ILogRepository";
import type Log from "@infrastructure/Database/Models/Log";
import type {PaginationDto} from "@infraUtils/PaginationDto";
import type {TSearchFilters} from "@typings/ORM";

type TSearchLog = TSearchFilters<Log> & {
    toDate?: string;
    fromDate?: string;
    text?: string;
};

@injectable()
class LogService {
    constructor(@inject("ILogRepository") private logRepository: ILogRepository) {}

    async getLogs(getLogDTO: GetLogDTO, paginationDTO?: PaginationDto) {
        try {
            const searchFilters: TSearchLog = getLogDTO;
            const pagination = PaginationOptions.create(paginationDTO);
            const logs = await this.logRepository.fetchPaginatedBySearchQuery(searchFilters, pagination);
            if (!logs) {
                return HttpResponse.notFound();
            }

            const logEntities = logs.rows.map((log) => LogEntity.create(log));

            return HttpResponse.ok(PaginationData.getPaginatedData(pagination, logs.count, logEntities));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}

export default LogService;
