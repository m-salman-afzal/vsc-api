import {COOKIE_CONFIG} from "@constants/AuthConstant";

import {HttpMessages, HttpStatus, HttpStatusCode} from "@appUtils/Http";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import AuthInfraService from "@infraServices/AuthInfraService";

import {setAdminId, setFacilityId} from "@logger/AuditLogger";
import {ErrorLog} from "@logger/ErrorLog";

import type {TNext, TRequest, TRequestSession, TResponse} from "@typings/Express";

export const LogoutMiddleware = async (request: TRequest, response: TResponse, next: TNext) => {
    try {
        const cookie = request.header("cookie");
        if (!cookie) {
            return HttpResponse.convertToExpress(response, HttpResponse.noContent());
        }

        const isSession = await AuthInfraService.isSessionVerified(request.session as unknown as TRequestSession);
        if (!isSession) {
            const {request: req, response: resp} = SharedUtils.destroySession(request, response, COOKIE_CONFIG);
            request = req;
            response = resp;

            return HttpResponse.convertToExpress(
                response,
                HttpResponse.create(HttpStatusCode.NOT_AUTHORIZED, {
                    status: HttpStatus.ERROR,
                    message: HttpMessages.INVALID_CREDS,
                    reload: true
                })
            );
        }

        const {
            passport: {
                user: {adminEntity}
            }
        } = request.session as unknown as TRequestSession;

        request.admin = adminEntity;
        setAdminId(null);
        setFacilityId(null);

        return next();
    } catch (error) {
        return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
    }
};
