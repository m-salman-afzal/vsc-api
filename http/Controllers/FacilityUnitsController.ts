import FacilityUnitValidation from "@validations/FacilityUnitValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {GetFacilityUnitDto} from "@application/FacilityUnit/Dtos/GetFacilityUnitDto";
import {UpdateLocationDto} from "@application/FacilityUnit/Dtos/UpdateLocationDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {facilityUnitsService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class FacilityUnitsController {
    static async getUnits(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            FacilityUnitValidation.getFacilityUnitValidation(query);
            const paginationDto = PaginationDto.create(query);
            const getFacilityUnitDto = GetFacilityUnitDto.create(query);
            const httpResponse = await facilityUnitsService.getUnits(getFacilityUnitDto, paginationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updateUnits(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            FacilityUnitValidation.updateFacilityUnitValidation({...body});
            const updateFacilityDto = UpdateLocationDto.create({...body});
            const httpResponse = await facilityUnitsService.updateLocations(updateFacilityDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getUnassignedUnits(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            const getFacilityDto = GetFacilityUnitDto.create({...query});
            const httpResponse = await facilityUnitsService.getUnassignedUnits(getFacilityDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
