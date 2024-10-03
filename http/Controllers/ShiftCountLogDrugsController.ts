import {ShiftCountLogDrugValidation} from "@validations/ShiftCountLogDrugValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {GetShiftCountLogDrugsDto} from "@application/ShiftCountLogDrugs/Dtos/GetShiftCountLogDrugsDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {shiftCountLogDrugService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class ShiftCountLogDrugsController {
    static async getShiftCountLogDrugs(request: TRequest, response: TResponse) {
        try {
            const {query, body} = request;
            ShiftCountLogDrugValidation.getShiftCountLogDrugsValidation({...query, ...body});
            const getShiftCountLogDrugsDto = GetShiftCountLogDrugsDto.create({...query, ...body});
            const paginationDTO = PaginationDto.create({...query, ...body});
            const httpResponse = await shiftCountLogDrugService.getShiftCountLogDrugs(
                getShiftCountLogDrugsDto,
                paginationDTO
            );

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
