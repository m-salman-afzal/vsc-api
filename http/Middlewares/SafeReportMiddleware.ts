import {PERMISSIONS, SAFE_REPORT_AUTH_ROUTES} from "@constants/AuthConstant";
import {SAFE_REPORT_STATUS} from "@constants/ReportConstant";

import {HttpStatusCode} from "@appUtils/Http";
import HttpResponse from "@appUtils/HttpResponse";

import AuthInfraService from "@infraServices/AuthInfraService";

import {ErrorLog} from "@logger/ErrorLog";

import type {TNext, TRequest, TRequestSession, TResponse} from "@typings/Express";

export const SafeReportMiddleware = async (request: TRequest, response: TResponse, next: TNext) => {
    try {
        const loggedInAdminId = request.admin?.adminId;

        const isSession = await AuthInfraService.isSessionVerified(request.session as unknown as TRequestSession);

        if (request.query["status"] === undefined) {
            request.query["status"] = [SAFE_REPORT_STATUS.UNDER_INVESTIGATION, SAFE_REPORT_STATUS.IN_REVIEW];
        }

        if (
            isSession &&
            isSession.rbac &&
            isSession.rbac[SAFE_REPORT_AUTH_ROUTES.SAFE_REPORT_INVESTIGATIONS] === PERMISSIONS.HIDE &&
            isSession.rbac[SAFE_REPORT_AUTH_ROUTES.SAFE_REPORT_REVIEWS] !== PERMISSIONS.HIDE
        ) {
            request.query["status"] = [SAFE_REPORT_STATUS.IN_REVIEW];
        }

        if (
            isSession &&
            isSession.rbac &&
            isSession.rbac[SAFE_REPORT_AUTH_ROUTES.SAFE_REPORT_INVESTIGATIONS] !== PERMISSIONS.HIDE &&
            isSession.rbac[SAFE_REPORT_AUTH_ROUTES.SAFE_REPORT_REVIEWS] === PERMISSIONS.HIDE
        ) {
            request.query["status"] = [SAFE_REPORT_STATUS.UNDER_INVESTIGATION];
        }

        let firstName: string | undefined;
        let lastName: string | undefined;
        if (request.query["text"]) {
            [firstName, lastName] = (request.query["text"] as string).split("");
        }

        if (
            isSession &&
            isSession.rbac &&
            isSession.rbac[SAFE_REPORT_AUTH_ROUTES.SAFE_REPORT_INVESTIGATIONS] !== PERMISSIONS.HIDE
        ) {
            if (
                request.query["text"] &&
                (request.admin?.firstName.includes(firstName) || request.admin?.lastName.includes(lastName))
            ) {
                const httpResponse = HttpResponse.notFound();

                return HttpResponse.convertToExpress(response, httpResponse);
            }

            request.query["investigationAdminId"] = loggedInAdminId;
        }

        if (
            isSession &&
            isSession.rbac &&
            isSession.rbac[SAFE_REPORT_AUTH_ROUTES.SAFE_REPORT_REVIEWS] !== PERMISSIONS.HIDE
        ) {
            if (request.query["text"]) {
                request.query["anonymous"] = "false";
            }
        }

        if (
            isSession &&
            isSession.rbac &&
            isSession.rbac[SAFE_REPORT_AUTH_ROUTES.SAFE_REPORT_INVESTIGATIONS] !== PERMISSIONS.HIDE &&
            isSession.rbac[SAFE_REPORT_AUTH_ROUTES.SAFE_REPORT_REVIEWS] !== PERMISSIONS.HIDE
        ) {
            request.query["investigationAdminId"] && delete request.query["investigationAdminId"];
        }

        return next();
    } catch (error) {
        const httpResponse = HttpResponse.create(HttpStatusCode.ERROR, {message: ErrorLog(error)});

        return HttpResponse.convertToExpress(response, httpResponse);
    }
};
