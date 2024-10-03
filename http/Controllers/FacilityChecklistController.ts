import {FacilityChecklistValidation} from "@validations/FacilityChecklistValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddFacilityChecklistDTO} from "@application/FacilityChecklist/DTOs/AddFacilityCheclistDTO";
import {GetFacilityChecklistDTO} from "@application/FacilityChecklist/DTOs/GetFacilityChecklistDTO";
import {GetFacilityChecklistSuggestionDTO} from "@application/FacilityChecklist/DTOs/GetFacilityChecklistSuggestionDTO";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {facilityChecklistService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class FacilityChecklistController {
    static async addFacilityChecklist(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            FacilityChecklistValidation.addFacilityChecklistValidation(body);
            const addFacilityChecklistDTO = AddFacilityChecklistDTO.create(body);
            const httpResponse = await facilityChecklistService.addFacilityChecklist(addFacilityChecklistDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error: unknown) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error as Error)}));
        }
    }

    static async getFacilityChecklist(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            FacilityChecklistValidation.getFacilityChecklistValidation(query);
            const getFacilityChecklistDTO = GetFacilityChecklistDTO.create(query);
            const httpResponse = await facilityChecklistService.getFacilityChecklist(getFacilityChecklistDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error: unknown) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error as Error)}));
        }
    }

    static async getFacilityAdminSuggestion(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            FacilityChecklistValidation.getFacilityChecklistSuggestionValidation(query);
            const getFacilityChecklistSuggestionDTO = GetFacilityChecklistSuggestionDTO.create(query);
            const paginationDto = PaginationDto.create(query);
            const httpResponse = await facilityChecklistService.getAdminSuggestion(
                getFacilityChecklistSuggestionDTO,
                paginationDto
            );

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error: unknown) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error as Error)}));
        }
    }
}
