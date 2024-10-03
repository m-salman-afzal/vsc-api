import ServiceDisruptionPatientValidation from "@validations/ServiceDisruptionPatientValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {GetServiceDisruptionPatientDto} from "@application/ServiceDisruptionPatient/Dtos/GetServiceDisruptionPatientDto";

import {serviceDisruptionPatientService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class ServiceDisruptionPatientController {
    static async getServiceDisruptionPatient(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            ServiceDisruptionPatientValidation.getServiceDisruptionPatientValidation(query);
            const ServiceDisruptionPatientDto = GetServiceDisruptionPatientDto.create(query);
            const httpResponse =
                await serviceDisruptionPatientService.getServiceDisruptionPatients(ServiceDisruptionPatientDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
