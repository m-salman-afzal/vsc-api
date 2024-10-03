import {ShiftCountLogValidation} from "@validations/ShiftCountLogValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddShiftCountLogsDto} from "@application/ShiftCountLogs/Dtos/AddShiftCountLogsDto";
import {GetShiftCountLogsDto} from "@application/ShiftCountLogs/Dtos/GetShiftCountLogsDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {shiftCountLogService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class ShiftCountLogsController {
    static async getShiftCountLogs(request: TRequest, response: TResponse) {
        try {
            const {query, body} = request;
            ShiftCountLogValidation.getShiftCountLogsValidation({...query, ...body});
            const getShiftCountLogsDto = GetShiftCountLogsDto.create({...query, ...body});
            const paginationDTO = PaginationDto.create({...query, ...body});
            const httpResponse = await shiftCountLogService.getShiftCountLogs(getShiftCountLogsDto, paginationDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async addShiftCountLogs(request: TRequest, response: TResponse) {
        try {
            const {query, body, admin} = request;
            ShiftCountLogValidation.addShiftCountLogsValidation({...query, ...body});
            const addShiftCountLogsDto = AddShiftCountLogsDto.create({...query, ...body});
            const httpResponse = await shiftCountLogService.addShiftCountLogs(addShiftCountLogsDto, admin);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
