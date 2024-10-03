import {ContactValidation} from "@validations/ContactValidation";
import {ProcessValidation} from "@validations/ProcessValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddContactDto} from "@application/Contact/Dtos/AddContactDto";
import {GetContactDto} from "@application/Contact/Dtos/GetContactDto";
import {RemoveContactDto} from "@application/Contact/Dtos/RemoveContactDto";
import {UpdateContactDto} from "@application/Contact/Dtos/UpdateContactDto";
import {GetProcessDto} from "@application/Process/Dtos/GetProcessDto";
import {UpdateProcessDto} from "@application/Process/Dtos/UpdateProcessDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {contactService, processService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class CommunicationsController {
    static async getProcesses(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            ProcessValidation.getProcessValidation(query);
            const getProcessDto = GetProcessDto.create(query);
            const httpResponse = await processService.getProcesses(getProcessDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updateProcess(request: TRequest, response: TResponse) {
        try {
            const {body, params} = request;
            ProcessValidation.updateProcessValidation({...body, ...params});
            const updateProcessDto = UpdateProcessDto.create({...body, ...params});
            const httpResponse = await processService.updateProcess(updateProcessDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async addContact(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            ContactValidation.addContactValidation(body);
            const addContactDto = AddContactDto.create(body);
            const httpResponse = await contactService.addContact(addContactDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getContacts(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            ContactValidation.getContactValidation(query);
            const getContactDto = GetContactDto.create(query);
            const paginationDto = PaginationDto.create(query);
            const httpResponse = await contactService.getContacts(getContactDto, paginationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updateContact(request: TRequest, response: TResponse) {
        try {
            const {body, params} = request;
            ContactValidation.updateContactValidation({...body, ...params});
            const updateContactDto = UpdateContactDto.create({...body, ...params});
            const httpResponse = await contactService.updateContact(updateContactDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async removeContact(request: TRequest, response: TResponse) {
        try {
            const {body, params} = request;
            ContactValidation.removeContactValidation({...body, ...params});
            const removeContactDto = RemoveContactDto.create({...body, ...params});
            const httpResponse = await contactService.removeContact(removeContactDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
