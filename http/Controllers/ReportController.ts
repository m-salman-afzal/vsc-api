import {ReportValidation} from "@validations/ReportValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddReportDto} from "@application/Report/Dtos/AddReportDto";
import {GetReportDto} from "@application/Report/Dtos/GetReportDto";
import {GetSafeReportDto} from "@application/Report/Dtos/GetSafeReportDto";
import {RemoveReportDto} from "@application/Report/Dtos/RemoveReportDto";
import {UpdateReportDto} from "@application/Report/Dtos/UpdateReportDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {reportService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class ReportController {
    static async addReport(request: TRequest, response: TResponse) {
        try {
            const {body, admin} = request;
            ReportValidation.addReportValidation({...body, adminId: admin?.adminId});
            const dto = AddReportDto.create({...body, adminId: admin?.adminId});
            const httpResponse = await reportService.addReport(dto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getReports(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            ReportValidation.getReportsValidation(query);
            const dto = GetReportDto.create(query);
            const paginationDto = PaginationDto.create(query);

            const httpResponse = await reportService.getReports(dto, paginationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getReport(request: TRequest, response: TResponse) {
        try {
            const {params} = request;
            ReportValidation.getReportValidation(params);
            const dto = GetSafeReportDto.create(params);

            const httpResponse = await reportService.getSafeReport(dto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updateReport(request: TRequest, response: TResponse) {
        try {
            const {body, params} = request;
            ReportValidation.updateReportValidation({...params, ...body});
            const dto = UpdateReportDto.create({...params, ...body});

            const httpResponse = await reportService.updateReport(dto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async removeReport(request: TRequest, response: TResponse) {
        try {
            const {body, params} = request;
            ReportValidation.removeReportValidation({...params, ...body});
            const dto = RemoveReportDto.create({...params, ...body});

            const httpResponse = await reportService.removeReport(dto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
