import bcrypt from "bcrypt";
import {DateTime} from "luxon";

import {FACILITY_FREE_ROUTES, PERMISSION_PRIORITY, REQUEST_METHODS_PRIORITY} from "@constants/AuthConstant";

import {SERVER_CONFIG} from "@appUtils/Constants";

import {auth} from "@infraConfig/index";

import {redisClient} from "@infrastructure/Database/RedisConnection";

import {ErrorLog} from "@logger/ErrorLog";

import type {AdminEntity} from "@entities/Admin/AdminEntity";
import type {TRequestSession} from "@typings/Express";

class AuthInfraService {
    encryptPassword(password: string) {
        return bcrypt.hash(password, 10);
    }

    async verifyUserCredentials(password: string, encodedPassword: string) {
        try {
            return await bcrypt.compare(password, encodedPassword);
        } catch (error) {
            ErrorLog(error);

            return false;
        }
    }

    verifyPasswordExpired(passwordResetOn: DateTime) {
        const {days} = DateTime.now().diff(passwordResetOn, "days").toObject();

        return (
            passwordResetOn === null ||
            (passwordResetOn && auth.PASSWORD_EXPIRY_DAYS && (days as number) >= Number(auth.PASSWORD_EXPIRY_DAYS))
        );
    }

    verifyAppVersion(appVersion: string) {
        return appVersion === SERVER_CONFIG.APP_VERSION;
    }

    verifyPortalAppVersion(appVersion: string) {
        return appVersion === SERVER_CONFIG.PORTAL_APP_VERSION;
    }

    facilityFreeRoute(baseRoute: string) {
        try {
            return FACILITY_FREE_ROUTES.includes(baseRoute);
        } catch (error) {
            ErrorLog(error);

            return false;
        }
    }

    hasAccessToFacility(adminEntity: AdminEntity, facilityId: string) {
        try {
            const isFacilities = adminEntity.facility?.filter((facility) => facility.facilityId === facilityId);

            return !!isFacilities?.length;
        } catch (error) {
            ErrorLog(error);

            return false;
        }
    }

    isAuthorized(rbac: object, method: string, baseRoute: string) {
        try {
            return REQUEST_METHODS_PRIORITY[method] >= PERMISSION_PRIORITY[rbac[baseRoute]];
        } catch (error) {
            ErrorLog(error);

            return false;
        }
    }

    async isSessionVerified(session: TRequestSession) {
        try {
            const {id} = session;
            const isSession = await redisClient.get(`fchSession:${id}`);

            if (!isSession) {
                return false;
            }

            const sessionObj = JSON.parse(isSession);

            const {
                passport: {
                    user: {adminEntity, rbac, appVersion}
                }
            } = sessionObj;

            return {adminEntity: adminEntity, appVersion: appVersion, rbac: rbac};
        } catch (error) {
            ErrorLog(error);

            return false;
        }
    }
}

export default new AuthInfraService();
