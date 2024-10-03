import {PERMISSIONS, SAFE_REPORT_AUTH_ROUTES} from "@constants/AuthConstant";

import {HttpStatusCode} from "@appUtils/Http";
import HttpResponse from "@appUtils/HttpResponse";

import AuthInfraService from "@infraServices/AuthInfraService";

import {ErrorLog} from "@logger/ErrorLog";

import type {TNext, TRequest, TRequestSession, TResponse} from "@typings/Express";

export const ReportMiddleware = async (request: TRequest, response: TResponse, next: TNext) => {
    try {
        const loggedInAdminId = request.admin?.adminId;

        const isSession = await AuthInfraService.isSessionVerified(request.session as unknown as TRequestSession);

        let firstName: string | undefined;
        let lastName: string | undefined;
        if (request.query["text"]) {
            [firstName, lastName] = (request.query["text"] as string).split(" ");
        }

        if (isSession && isSession.rbac && isSession.rbac[SAFE_REPORT_AUTH_ROUTES.REPORT] !== PERMISSIONS.HIDE) {
            if (
                request.query["text"] &&
                (request.admin?.firstName.includes(firstName) || request.admin?.lastName.includes(lastName))
            ) {
                const httpResponse = HttpResponse.notFound();

                return HttpResponse.convertToExpress(response, httpResponse);
            }

            request.query["adminId"] = loggedInAdminId;
        }

        if (
            isSession &&
            isSession.rbac &&
            isSession.rbac[SAFE_REPORT_AUTH_ROUTES.REPORT_HISTORY] !== PERMISSIONS.HIDE
        ) {
            if (request.query["text"]) {
                request.query["isAnonymous"] = "false";
            }
        }

        if (
            isSession &&
            isSession.rbac &&
            isSession.rbac[SAFE_REPORT_AUTH_ROUTES.REPORT_HISTORY] !== PERMISSIONS.HIDE &&
            isSession.rbac[SAFE_REPORT_AUTH_ROUTES.REPORT] !== PERMISSIONS.HIDE
        ) {
            request.query["adminId"] && delete request.query["adminId"];
        }

        return next();
    } catch (error) {
        const httpResponse = HttpResponse.create(HttpStatusCode.ERROR, {message: ErrorLog(error)});

        return HttpResponse.convertToExpress(response, httpResponse);
    }
};
