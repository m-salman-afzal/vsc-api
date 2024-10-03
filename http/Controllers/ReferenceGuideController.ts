import {FileValidation} from "@validations/FileValidation";
import {ReferenceGuideValidation} from "@validations/ReferenceGuideValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddFileDto} from "@application/File/Dtos/AddFileDto";
import {AddReferenceGuideDto} from "@application/ReferenceGuide/Dtos/AddReferenceGuideDto";
import {GetReferenceGuideDto} from "@application/ReferenceGuide/Dtos/GetReferenceGuideDto";
import {ModifyReferenceGuideDto} from "@application/ReferenceGuide/Dtos/ModifyReferenceGuideDto";
import {RemoveReferenceGuideDto} from "@application/ReferenceGuide/Dtos/RemoveReferenceGuideDto";
import {SetReferenceGuideNoteDto} from "@application/ReferenceGuide/Dtos/SetReferenceGuideNoteDto";
import {UpdateReferenceGuideDto} from "@application/ReferenceGuide/Dtos/UpdateReferenceGuideDto";

import {referenceGuideService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class ReferenceGuideController {
    static async getReferenceGuides(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            ReferenceGuideValidation.getReferenceGuideValidation(query);
            const dtoGetReferenceGuide = GetReferenceGuideDto.create(query);
            const httpResponse = await referenceGuideService.getReferenceGuides(dtoGetReferenceGuide);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async addReferenceGuide(request: TRequest, response: TResponse) {
        try {
            const {body, admin, query} = request;
            FileValidation.addFileValidation({...body, ...query});
            ReferenceGuideValidation.addReferenceGuideValidation({...body, ...query});
            const dtoAddFile = AddFileDto.create({...body, ...query, adminId: admin?.adminId});
            const dtoAddReferenceGuide = AddReferenceGuideDto.create({...body, ...query});

            const httpResponse = await referenceGuideService.addReferenceGuide(dtoAddReferenceGuide, dtoAddFile);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async modifyReferenceGuide(request: TRequest, response: TResponse) {
        try {
            const {body, admin, query} = request;
            FileValidation.addFileValidation({...body, ...query});
            ReferenceGuideValidation.modifyReferenceGuideValidation({...body, ...query});
            const dtoAddFile = AddFileDto.create({...body, ...query, adminId: admin?.adminId});
            const dtoModifyReferenceGuide = ModifyReferenceGuideDto.create({...body, ...query});

            const httpResponse = await referenceGuideService.modifyReferenceGuide(dtoModifyReferenceGuide, dtoAddFile);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updateReferenceGuide(request: TRequest, response: TResponse) {
        try {
            const {body, params, query} = request;
            ReferenceGuideValidation.updateReferenceGuideValidation({...body, ...query, ...params});

            const dtoUpdateReferenceGuide = UpdateReferenceGuideDto.create({...body, ...query, ...params});
            const httpResponse = await referenceGuideService.updateReferenceGuide(dtoUpdateReferenceGuide);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async removeReferenceGuide(request: TRequest, response: TResponse) {
        try {
            const {params, query} = request;
            ReferenceGuideValidation.removeReferenceGuideValidation({...query, ...params});

            const dtoRemoveReferenceGuide = RemoveReferenceGuideDto.create({...query, ...params});
            const httpResponse = await referenceGuideService.removeReferenceGuide(dtoRemoveReferenceGuide);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async setReferenceGuideNote(request: TRequest, response: TResponse) {
        try {
            const {body, params, query} = request;
            ReferenceGuideValidation.setReferenceGuideNoteValidation({...body, ...query, ...params});

            const dtoReferenceGuideNote = SetReferenceGuideNoteDto.create({...body, ...query, ...params});
            const httpResponse = await referenceGuideService.setReferenceGuideNote(dtoReferenceGuideNote);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async removeReferenceGuideNote(request: TRequest, response: TResponse) {
        try {
            const {body, params, query} = request;
            ReferenceGuideValidation.removeReferenceGuideValidation({...body, ...query, ...params});

            const dtoRemoveReferenceGuideNote = RemoveReferenceGuideDto.create({...body, ...query, ...params});
            const httpResponse = await referenceGuideService.removeReferenceGuideNote(dtoRemoveReferenceGuideNote);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
