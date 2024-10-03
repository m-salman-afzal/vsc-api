import {REPOSITORIES} from "@constants/FileConstant";

import {FileValidation} from "@validations/FileValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddFileDto} from "@application/File/Dtos/AddFileDto";
import {DownloadFileDto} from "@application/File/Dtos/DownloadFileDto";
import {GetFileDto} from "@application/File/Dtos/GetFileDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {fileService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class FileController {
    static async addFile(request: TRequest, response: TResponse) {
        try {
            const {body, admin} = request;
            FileValidation.addFileValidation(body);
            const addFileDto = AddFileDto.create({...body, adminId: admin?.adminId});
            const httpResponse = await fileService.addFile(addFileDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getFiles(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            FileValidation.getFileValidation(query);
            const getFileDto = GetFileDto.create(query);
            const paginationDto = PaginationDto.create(query);
            const httpResponse = await fileService.getFiles(getFileDto, paginationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async addDivisionStatsFile(request: TRequest, response: TResponse) {
        try {
            const {body, admin} = request;
            FileValidation.addDivisionStatsFileValidation(body);
            const addFileDto = AddFileDto.create({
                ...body,
                repository: REPOSITORIES.SHERIFF_DIVISION,
                adminId: admin?.adminId
            });
            const httpResponse = await fileService.addFile(addFileDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async downloadFile(request: TRequest, response: TResponse) {
        try {
            const {query, params} = request;
            FileValidation.downloadFileValidation({...query, ...params});
            const downloadFileDto = DownloadFileDto.create({...query, ...params});
            const httpResponse = await fileService.downloadFile(downloadFileDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async addAdministrativeFile(request: TRequest, response: TResponse) {
        try {
            const {body, admin} = request;
            FileValidation.addAdministrativeFileValidation(body);
            const addFileDto = AddFileDto.create({
                ...body,
                repository: REPOSITORIES.ADMINISTRATIVE_DIVISION,
                adminId: admin?.adminId
            });
            const httpResponse = await fileService.addFile(addFileDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
