import {PERMISSIONS} from "@constants/AuthConstant";

import {FOMMULARY_AUTH_ROUTES} from "@appUtils/Constants";
import {HttpStatusCode} from "@appUtils/Http";
import HttpResponse from "@appUtils/HttpResponse";

import AuthInfraService from "@infraServices/AuthInfraService";

import {ErrorLog} from "@logger/ErrorLog";

import type {TNext, TRequest, TRequestSession, TResponse} from "@typings/Express";

export const FormularyMiddleware = async (request: TRequest, response: TResponse, next: TNext) => {
    try {
        const {baseUrl} = request;
        const baseRoute = baseUrl.split("/").pop() as string;
        const isSession = await AuthInfraService.isSessionVerified(request.session as unknown as TRequestSession);

        if (isSession && isSession.rbac && isSession.rbac[baseRoute] !== PERMISSIONS.HIDE) {
            if (baseRoute === FOMMULARY_AUTH_ROUTES.CONTROLLED) {
                request.query["isControlled"] = "true";
            }

            if (baseRoute === FOMMULARY_AUTH_ROUTES.NON_CONTROLLED) {
                request.query["isControlled"] = "false";
            }
        }

        return next();
    } catch (error) {
        const httpResponse = HttpResponse.create(HttpStatusCode.ERROR, {message: ErrorLog(error)});

        return HttpResponse.convertToExpress(response, httpResponse);
    }
};
