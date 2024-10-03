import {PERMISSIONS} from "@constants/AuthConstant";

import {HttpStatusCode} from "@appUtils/Http";
import HttpResponse from "@appUtils/HttpResponse";

import AuthInfraService from "@infraServices/AuthInfraService";

import {ErrorLog} from "@logger/ErrorLog";

import type {TNext, TRequest, TRequestSession, TResponse} from "@typings/Express";

export const InventoryMiddleware = async (request: TRequest, response: TResponse, next: TNext) => {
    try {
        const isSession = await AuthInfraService.isSessionVerified(request.session as unknown as TRequestSession);

        if (isSession && isSession.rbac) {
            const rbacStatus = {
                controlled: isSession.rbac.formularyControlled,
                nonControlled: isSession.rbac.formularyNonControlled
            };

            if (
                isSession.rbac.formularyControlled === PERMISSIONS.HIDE &&
                isSession.rbac.formularyNonControlled === PERMISSIONS.HIDE
            ) {
                const httpResponse = HttpResponse.notFound();

                return HttpResponse.convertToExpress(response, httpResponse);
            }

            switch (true) {
                case rbacStatus.controlled !== PERMISSIONS.HIDE && rbacStatus.nonControlled === PERMISSIONS.HIDE:
                    request.query["isControlled"] = "true";
                    break;

                case rbacStatus.controlled === PERMISSIONS.HIDE && rbacStatus.nonControlled !== PERMISSIONS.HIDE:
                    request.query["isControlled"] = "false";
                    break;
            }

            return next();
        }

        const httpResponse = HttpResponse.notFound();

        return HttpResponse.convertToExpress(response, httpResponse);
    } catch (error) {
        const httpResponse = HttpResponse.create(HttpStatusCode.ERROR, {message: ErrorLog(error)});

        return HttpResponse.convertToExpress(response, httpResponse);
    }
};
