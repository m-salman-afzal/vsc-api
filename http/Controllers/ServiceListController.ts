import {ServiceListValidation} from "@validations/ServiceListValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddServiceListDto} from "@application/ServiceList/Dtos/AddServiceListDto";
import {GetServiceListDto} from "@application/ServiceList/Dtos/GetServiceListDto";
import {RemoveServiceListDto} from "@application/ServiceList/Dtos/RemoveServiceListDto";
import {UpdateServiceListDto} from "@application/ServiceList/Dtos/UpdateServiceListDto";

import {serviceListService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class ServiceListController {
    static async getServiceLists(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            ServiceListValidation.getServiceListValidation(query);
            const getServiceListDto = GetServiceListDto.create(query);
            const httpResponse = await serviceListService.getServiceLists(getServiceListDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async addServiceList(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            ServiceListValidation.addServiceListValidation(body);
            const addServiceListDto = AddServiceListDto.create(body);
            const httpResponse = await serviceListService.addServiceList(addServiceListDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updateServiceList(request: TRequest, response: TResponse) {
        try {
            const {params, body} = request;
            ServiceListValidation.updateServiceListValidation({...params, ...body});
            const updateServiceListDto = UpdateServiceListDto.create({...params, ...body});
            const httpResponse = await serviceListService.updateServiceList(updateServiceListDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async removeServiceList(request: TRequest, response: TResponse) {
        try {
            const {params} = request;
            ServiceListValidation.removeServiceListValidation(params);
            const removeServiceListDto = RemoveServiceListDto.create(params);
            const httpResponse = await serviceListService.removeServiceList(removeServiceListDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
