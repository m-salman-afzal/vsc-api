import DivisionValidation from "@validations/DivisionValidation";

import HttpResponse from "@appUtils/HttpResponse";

import GetDivisionDTO from "@application/Division/DTOs/GetDivisionDTO";
import GetDivisionReportDTO from "@application/Division/DTOs/GetDivisionReportDTO";

import {divisionService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

class DivisionController {
    static async getDivisions(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            DivisionValidation.getDivisionValidation(query);
            const dtoGetDivision = GetDivisionDTO.create(query as unknown as GetDivisionDTO);
            const httpResponse = await divisionService.getDivisions(dtoGetDivision);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getReports(request: TRequest, response: TResponse) {
        try {
            const {query, admin} = request;
            DivisionValidation.getDivisionReportValidation(query);
            const adminType = admin ? admin.adminType : null;
            const dtoGetDivision = GetDivisionReportDTO.create(query as unknown as GetDivisionReportDTO);
            const httpResponse = await divisionService.getReports(dtoGetDivision, adminType);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}

export default DivisionController;
