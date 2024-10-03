import {FacilityValidation} from "@validations/FacilityValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddFacilityDTO} from "@application/Facility/DTOs/AddFacilityDTO";
import {GetFacilityDTO} from "@application/Facility/DTOs/GetFacilityDTO";
import {RemoveFacilityDTO} from "@application/Facility/DTOs/RemoveFacilityDTO";
import {UpdateFacilityDTO} from "@application/Facility/DTOs/UpdateFacilityDTO";

import {facilityService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class FacilityController {
    static async addFacility(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            FacilityValidation.addFacilityValidation(body);
            const addFacilityDTO = AddFacilityDTO.create(body);
            const httpResponse = await facilityService.addFacility(addFacilityDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getFacilities(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            FacilityValidation.getFacilityValidation(query);
            const getFacilityDTO = GetFacilityDTO.create(query);
            const httpResponse = await facilityService.getFacilities(getFacilityDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updateFacility(request: TRequest, response: TResponse) {
        try {
            const {body, params} = request;
            FacilityValidation.updateFacilityValidation({...body, ...params});
            const updateFacilityDTO = UpdateFacilityDTO.create({...body, ...params});
            const httpResponse = await facilityService.updateFacility(updateFacilityDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async removeFacility(request: TRequest, response: TResponse) {
        try {
            const {body, params} = request;
            FacilityValidation.removeFacilityValidation({...body, ...params});
            const removeFacilityDTO = RemoveFacilityDTO.create({...body, ...params});
            const httpResponse = await facilityService.removeFacility(removeFacilityDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
