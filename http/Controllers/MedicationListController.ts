import {MedicationListValidation} from "@validations/MedicationListValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {DownloadMedicationListDTO} from "@application/MedicationList/DTOs/DownloadMedicationListDTO";
import {GetMedicationListDTO} from "@application/MedicationList/DTOs/GetMedicationListDTO";
import {GetMedicationListLastUpdateDTO} from "@application/MedicationList/DTOs/GetMedicationListLastUpdateDTO";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {medicationListService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class MedicationListController {
    static async getMedicationList(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            MedicationListValidation.getMedicationList(query);
            const dtoGetMedicationList = GetMedicationListDTO.create(query as unknown as GetMedicationListDTO);
            const paginationDTO = PaginationDto.create(query);
            const httpResponse = await medicationListService.getMedicationList(dtoGetMedicationList, paginationDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async downloadMedicationList(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            MedicationListValidation.downloadMedicationList(query);
            const dtoDownloadMedicationList = DownloadMedicationListDTO.create(
                query as unknown as DownloadMedicationListDTO
            );
            const httpResponse = await medicationListService.downloadMedicationList(dtoDownloadMedicationList);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getMedicationListLastUpdate(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            MedicationListValidation.getMedicationListLastUpdate(query);
            const dtoGetMedicationListLastUpdate = GetMedicationListLastUpdateDTO.create(
                query as unknown as GetMedicationListLastUpdateDTO
            );
            const httpResponse =
                await medicationListService.getMedicationListLastUpdate(dtoGetMedicationListLastUpdate);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
