import {NotificationValidation} from "@validations/NotificationValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {GetNotificationDto} from "@application/Notification/DTOs/GetNotificationDTO";
import {MarkAsArchiveNotificationAdminDto} from "@application/NotificationAdmins/DTOs/MarkAsArchiveNotificationDto";
import {MarkAsReadNotificationAdminDTO} from "@application/NotificationAdmins/DTOs/MarkAsReadNotificationAdminDTO";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {notificationAdminService, notificationService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class NotificationController {
    static async getNotification(request: TRequest, response: TResponse) {
        try {
            const {admin, query} = request;
            NotificationValidation.getNotificationValidation({...admin, ...query});
            const getNotificationDto = GetNotificationDto.create({...admin, ...query});
            const paginationDto = PaginationDto.create(query);
            const httpResponse = await notificationService.getNotification(getNotificationDto, paginationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error as Error)}));
        }
    }

    static async getFacilities(request: TRequest, response: TResponse) {
        try {
            const {admin, query} = request;
            NotificationValidation.getFacilitiesValidation({...admin, ...query});
            const getNotificationDto = GetNotificationDto.create({...admin, ...query});
            const httpResponse = await notificationService.getFacilities(getNotificationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error as Error)}));
        }
    }

    static async markAsRead(request: TRequest, response: TResponse) {
        try {
            const {params, body} = request;
            NotificationValidation.markAsReadValidation({...params, ...body});
            const markAsReadNotificationdto = MarkAsReadNotificationAdminDTO.create({...body, ...params});
            const httpResponse = await notificationAdminService.markAsReadNotification(markAsReadNotificationdto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error as Error)}));
        }
    }

    static async markAsArchive(request: TRequest, response: TResponse) {
        try {
            const {params, body} = request;
            NotificationValidation.markAsArchiveNotificationValidation({...params, ...body});
            const markAsArchiveNotificationDto = MarkAsArchiveNotificationAdminDto.create({...body, ...params});
            const httpResponse = await notificationAdminService.markAsArchiveNotification(markAsArchiveNotificationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error as Error)}));
        }
    }
}
