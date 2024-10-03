import {PatientValidation} from "@validations/PatientValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {GetPatientDTO} from "@application/Patient/DTOs/GetPatientDTO";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {patientService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class PatientController {
    static async getPatients(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            PatientValidation.getPatientValidation(query);
            const getPatientDTO = GetPatientDTO.create(query);
            const paginationDTO = PaginationDto.create(query);
            const httpResponse = await patientService.getPatients(getPatientDTO, paginationDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
