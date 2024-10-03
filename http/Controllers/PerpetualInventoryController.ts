import {PerpetualInventoryValidaton} from "@validations/PerpetualInventoryValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddPerpetualInventoryDeductionDto} from "@application/PerpetualInventory/Dtos/AddPerpetualInventoryDeductionDto";
import {AddStaffSignatureDto} from "@application/PerpetualInventory/Dtos/AddStaffSignatureDto";
import {GetAllPerpetualInventoryDto} from "@application/PerpetualInventory/Dtos/GetAllPerpetualInventoryDto";
import {GetCartsDto} from "@application/PerpetualInventory/Dtos/GetCartsDto";
import {GetPerpetualInventoryDto} from "@application/PerpetualInventory/Dtos/GetPerpetualInventoryDto";
import {GetPerpetualInventorySignatureDto} from "@application/PerpetualInventory/Dtos/GetPerpetualInventoryStaffSignatureDto";
import {RemovePerpetualInventoryDto} from "@application/PerpetualInventory/Dtos/RemovePerpetualInventoryDto";
import {UnarchivePerpetualInventoryDto} from "@application/PerpetualInventory/Dtos/UnarchivePerpetualInventory";
import {UpdatePerpetualInventoryDto} from "@application/PerpetualInventory/Dtos/UpdatePerpetualInventoryDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {perpetualInventoryService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class PerpetualInventoryController {
    static async getPerpetualInventory(request: TRequest, response: TResponse) {
        try {
            const {query, body} = request;
            PerpetualInventoryValidaton.getPerpetualInventoryValidation({...query, ...body});
            const getPerpetualInventoryDto = GetPerpetualInventoryDto.create({...query, ...body});
            const paginationDTO = PaginationDto.create({...query, ...body});
            const httpResponse = await perpetualInventoryService.getPerpetualInventory(
                getPerpetualInventoryDto,
                paginationDTO
            );

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updatePerpetualInventory(request: TRequest, response: TResponse) {
        try {
            const {params, admin, body} = request;
            PerpetualInventoryValidaton.updatePerpetualInventoryValidation({...body, ...params, ...admin});
            const updatePerpetualInventoryDto = UpdatePerpetualInventoryDto.create({...body, ...params, ...admin});
            const httpResponse = await perpetualInventoryService.updatePerpetualInventory(updatePerpetualInventoryDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
    static async unarchivePerpetualInventory(request: TRequest, response: TResponse) {
        try {
            const {params, body} = request;
            PerpetualInventoryValidaton.unarchivePerpetualInventoryValidation({...body, ...params});
            const updatePerpetualInventoryDto = UnarchivePerpetualInventoryDto.create({...body, ...params});
            const httpResponse =
                await perpetualInventoryService.unarchivePerpetualInventory(updatePerpetualInventoryDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async removePerpetualInventory(request: TRequest, response: TResponse) {
        try {
            const {params, body, admin} = request;
            PerpetualInventoryValidaton.removePerpetualInventoryValidation({...body, ...params, ...admin});
            const removePerpetualInventoryDto = RemovePerpetualInventoryDto.create({...body, ...params, ...admin});
            const httpResponse = await perpetualInventoryService.removePerpetualInventory(removePerpetualInventoryDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async addStaffSignature(request: TRequest, response: TResponse) {
        try {
            const {params, body} = request;
            PerpetualInventoryValidaton.addStaffSignatureValidation({...body, ...params});
            const addStaffSignatureDto = AddStaffSignatureDto.create({...body, ...params});
            const httpResponse = await perpetualInventoryService.addStaffSignature(addStaffSignatureDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async addPerpetualInventoryDeduction(request: TRequest, response: TResponse) {
        try {
            const {params, body, admin} = request;
            PerpetualInventoryValidaton.addPerpetualInventoryDeductionValidation({
                ...params,
                ...body,
                adminId: admin.adminId
            });
            const addPerpetualInventoryDeductionDto = AddPerpetualInventoryDeductionDto.create({
                ...params,
                ...body,
                adminId: admin.adminId
            });

            const httpReponse = await perpetualInventoryService.addPerpetualInventoryDeduction(
                addPerpetualInventoryDeductionDto
            );

            return HttpResponse.convertToExpress(response, httpReponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getPerpetualInventorySignature(request: TRequest, response: TResponse) {
        try {
            const {query, body} = request;
            PerpetualInventoryValidaton.getPerpetualInventorySignatureValidation({...body, ...query});
            const getSignatureDto = GetPerpetualInventorySignatureDto.create({...body, ...query});
            const httpReponse = await perpetualInventoryService.getPerpetualInventorySignature(getSignatureDto);

            return HttpResponse.convertToExpress(response, httpReponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getCarts(request: TRequest, response: TResponse) {
        try {
            const {query, body} = request;
            PerpetualInventoryValidaton.getCartsValidation({...body, ...query});
            const getCartsDto = GetCartsDto.create({...body, ...query});

            const httpReponse = await perpetualInventoryService.getCarts(getCartsDto);

            return HttpResponse.convertToExpress(response, httpReponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getAllPerpetualInventory(request: TRequest, response: TResponse) {
        try {
            const {query, body} = request;

            PerpetualInventoryValidaton.getPerpetualInventoryValidation({...query, ...body});
            const getPerpetualInventoryDto = GetAllPerpetualInventoryDto.create({...query, ...body});
            const httpResponse = await perpetualInventoryService.getAllPerpetualInventory(getPerpetualInventoryDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
