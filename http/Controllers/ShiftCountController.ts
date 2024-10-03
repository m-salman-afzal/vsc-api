import {ShiftCountValidation} from "@validations/ShiftCountValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {GetCartsDto} from "@application/ShiftCount/Dtos/GetCartsDto";
import {GetShiftCountDto} from "@application/ShiftCount/Dtos/GetShiftCountLogsDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {shiftCountService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class ShiftCountController {
    static async getShiftCount(request: TRequest, response: TResponse) {
        try {
            const {query, body} = request;
            ShiftCountValidation.getShiftCountValidation({...query, ...body});
            const getShiftCountDto = GetShiftCountDto.create({...query, ...body});
            const paginationDTO = PaginationDto.create({...query, ...body});
            const httpResponse = await shiftCountService.getShiftCount(getShiftCountDto, paginationDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getCarts(request: TRequest, response: TResponse) {
        try {
            const {query, body} = request;
            ShiftCountValidation.getCartsValidation({...body, ...query});
            const getCartsDto = GetCartsDto.create({...body, ...query});

            const httpReponse = await shiftCountService.getCarts(getCartsDto);

            return HttpResponse.convertToExpress(response, httpReponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
