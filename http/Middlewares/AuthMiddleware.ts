import LogEntity from "@entities/Log/LogEntity";

import {COMMON_ROUTES, COOKIE_CONFIG, SHERIFF_OFFICE_ACCESS_ROLES} from "@constants/AuthConstant";

import {REQUEST_METHODS} from "@appUtils/Constants";
import {HttpMessages, HttpStatus, HttpStatusCode} from "@appUtils/Http";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import AuthInfraService from "@infraServices/AuthInfraService";

import {logRepository} from "@infrastructure/DIContainer/Resolver";

import {setAdminId, setFacilityId} from "@logger/AuditLogger";
import {ErrorLog} from "@logger/ErrorLog";

import type AddLogDTO from "@application/Log/DTOs/AddLogDTO";
import type {TNext, TRequest, TRequestSession, TResponse} from "@typings/Express";

const SHERIFF_OFFICE_ADMIN_TYPES = [
    SHERIFF_OFFICE_ACCESS_ROLES.SHERIFF_OFFICE_READER,
    SHERIFF_OFFICE_ACCESS_ROLES.SHERIFF_OFFICE_WRITER,
    SHERIFF_OFFICE_ACCESS_ROLES.SHERIFF_OFFICE_CONFIDENTIAL
] as const;

export const AuthMiddleware = async (request: TRequest, response: TResponse, next: TNext) => {
    try {
        const cookie = request.header("cookie");
        if (!cookie) {
            return HttpResponse.convertToExpress(
                response,
                HttpResponse.notAuthorized({
                    message: HttpMessages.INVALID_CREDS
                })
            );
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

        const isPortalUser = SHERIFF_OFFICE_ADMIN_TYPES.includes(
            isSession.adminEntity.adminType as (typeof SHERIFF_OFFICE_ADMIN_TYPES)[number]
        );

        const appVersion = isPortalUser
            ? AuthInfraService.verifyPortalAppVersion(isSession.appVersion)
            : AuthInfraService.verifyAppVersion(isSession.appVersion);

        if (!appVersion) {
            const {request: req, response: resp} = SharedUtils.destroySession(request, response, COOKIE_CONFIG);
            request = req;
            response = resp;

            return HttpResponse.convertToExpress(
                response,
                HttpResponse.create(HttpStatusCode.NOT_AUTHORIZED, {
                    status: HttpStatus.ERROR,
                    message: HttpMessages.VERSION_MISMATCH,
                    reload: true
                })
            );
        }
        setAdminId(null);
        setFacilityId(null);

        const {method, baseUrl} = request;
        const baseRoute = baseUrl.split("/").pop() as string;
        const isAuthorized = isSession.rbac && AuthInfraService.isAuthorized(isSession.rbac, method, baseRoute);
        const isAuthorizedCommonRequest = COMMON_ROUTES.includes(`${baseRoute}/`);
        const facilityFreeRoute = AuthInfraService.facilityFreeRoute(baseRoute);
        if (!isPortalUser && !facilityFreeRoute) {
            const isFacilityAuthorized = AuthInfraService.hasAccessToFacility(
                isSession.adminEntity,
                request.query["facilityId"] as string
            );

            if (!isFacilityAuthorized || !(isAuthorized || isAuthorizedCommonRequest)) {
                return HttpResponse.convertToExpress(
                    response,
                    HttpResponse.forbidden({message: HttpMessages.FORBIDDEN})
                );
            }
        }

        setAdminId((request.session as unknown as TRequestSession).passport.user.adminEntity.adminId);
        setFacilityId(request.query["facilityId"] as string);
        await logRequest(request, request.session as unknown as TRequestSession);
        trimGetRequest(request);

        request.admin = isSession.adminEntity;

        return next();
    } catch (error) {
        return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
    }
};

const logRequest = async (request: TRequest, session: TRequestSession) => {
    if (request.method !== REQUEST_METHODS.GET) {
        const {originalUrl, query, params, body} = request;
        const logData: AddLogDTO = {
            logId: SharedUtils.shortUuid(),
            adminId: session.passport.user.adminEntity.adminId,
            reqUrl: originalUrl,
            method: request.method,
            payload: JSON.stringify({...query, ...params, ...body})
        };

        const logEntity = LogEntity.create(logData);
        await logRepository.create(logEntity);
    }
};

const trimGetRequest = async (request: TRequest) => {
    if (request.method === REQUEST_METHODS.GET) {
        for (const [key, value] of Object.entries(request.query)) {
            if (typeof value === "string") {
                request.query[key] = value.trim();
            }

            if (Array.isArray(value)) {
                request.query[key] = (value as string[]).map((v) => v.trim());
            }
        }
    }
};
