import {DateTime} from "luxon";
import {inject, injectable} from "tsyringe";

import {AdminEntity} from "@entities/Admin/AdminEntity";

import {APP_NAME, SHERIFF_OFFICE_ACCESS_ROLES} from "@constants/AuthConstant";

import {APP_URLS, SERVER_CONFIG} from "@appUtils/Constants";
import {HttpMessages, HttpStatus, HttpStatusCode} from "@appUtils/Http";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import AdminFilter from "@repositories/Shared/ORM/AdminFilter";

import {auth} from "@infraConfig/index";

import AuthInfraService from "@infraServices/AuthInfraService";

import {redisClient} from "@infrastructure/Database/RedisConnection";
import {emailUtils} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type ForgotPasswordDTO from "./DTOs/ForgotPasswordDTO";
import type LoginDTO from "./DTOs/LoginDTO";
import type ResetPasswordDTO from "./DTOs/ResetPasswordDTO";
import type {IAdminRepository} from "@entities/Admin/IAdminRepository";
import type {TRequest, TRequestSession} from "@src/typings/Express";

@injectable()
class AuthUserService {
    constructor(@inject("IAdminRepository") private adminRepository: IAdminRepository) {}

    async login(loginDTO: LoginDTO, request: TRequest) {
        try {
            if (loginDTO.appName !== APP_NAME.SHERIFF_PORTAL_APP) {
                return HttpResponse.create(HttpStatusCode.NOT_AUTHORIZED, {
                    status: HttpStatus.ERROR,
                    message: HttpMessages.INVALID_APP_NAME,
                    reload: true
                });
            }
            if (!AuthInfraService.verifyPortalAppVersion(loginDTO.appVersion)) {
                return HttpResponse.create(HttpStatusCode.NOT_AUTHORIZED, {
                    status: HttpStatus.ERROR,
                    message: HttpMessages.VERSION_MISMATCH,
                    reload: true
                });
            }

            const searchFilters = AdminFilter.setFilter({
                email: loginDTO.email,
                adminTypes: [
                    SHERIFF_OFFICE_ACCESS_ROLES.SHERIFF_OFFICE_READER,
                    SHERIFF_OFFICE_ACCESS_ROLES.SHERIFF_OFFICE_WRITER,
                    SHERIFF_OFFICE_ACCESS_ROLES.SHERIFF_OFFICE_CONFIDENTIAL
                ]
            });

            const admin = await this.adminRepository.fetch(searchFilters);

            if (!admin) {
                return HttpResponse.notAuthorized({message: HttpMessages.INVALID_CREDS});
            }

            const adminEntity = AdminEntity.create(admin);

            const loginTries = ++adminEntity.loginTries;
            if (loginTries > auth.MAX_LOGIN_TRIES) {
                return HttpResponse.create(HttpStatusCode.NOT_AUTHORIZED, {
                    status: HttpStatus.ERROR,
                    message: HttpMessages.INVALID_PASSWORD,
                    passwordExpired: true
                });
            }

            if (adminEntity.loginTries < auth.MAX_LOGIN_TRIES) {
                await this.adminRepository.update({adminId: adminEntity.adminId}, adminEntity);
            }

            const comparePassword = await AuthInfraService.verifyUserCredentials(
                loginDTO.password,
                adminEntity.password
            );
            if (!comparePassword) {
                if (adminEntity.loginTries === auth.MAX_LOGIN_TRIES) {
                    adminEntity.resetPasswordToken = SharedUtils.generateUuid();
                    await this.adminRepository.update({adminId: adminEntity.adminId}, adminEntity);
                    await emailUtils.suspiciousActivityEmail({
                        admin: adminEntity,
                        resetPasswordLink: APP_URLS.PORTAL_RESET_PASSWORD_URL,
                        appName: APP_NAME.SHERIFF_PORTAL_APP
                    });

                    return HttpResponse.create(HttpStatusCode.NOT_AUTHORIZED, {
                        status: HttpStatus.ERROR,
                        message: HttpMessages.INVALID_PASSWORD,
                        passwordExpired: true
                    });
                }

                return HttpResponse.create(HttpStatusCode.NOT_AUTHORIZED, {
                    status: HttpStatus.ERROR,
                    message: `Invalid Password, you have ${auth.MAX_LOGIN_TRIES - adminEntity.loginTries} ${
                        auth.MAX_LOGIN_TRIES - adminEntity.loginTries > 1 ? "tries" : "try"
                    } left`,
                    passwordExpired: false
                });
            }

            const passwordExpired = AuthInfraService.verifyPasswordExpired(
                DateTime.fromISO(adminEntity.passwordResetOn)
            );
            if (passwordExpired) {
                return HttpResponse.passwordExpired({message: HttpMessages.PASSWORD_EXPIRE});
            }

            adminEntity.loginTries = 0;

            const sessionKey = `fchSession:${adminEntity.sessionId}`;
            const isSessionActive = await redisClient.exists(sessionKey);
            if (isSessionActive) {
                await redisClient.del(sessionKey);
            }

            (request.session as unknown as TRequestSession).passport = {
                user: {
                    adminEntity: AdminEntity.publicFields(adminEntity) as AdminEntity,
                    appVersion: SERVER_CONFIG.PORTAL_APP_VERSION
                }
            };
            adminEntity.sessionId = request.sessionID;
            await this.adminRepository.update({adminId: adminEntity.adminId}, adminEntity);

            return HttpResponse.create(HttpStatusCode.OK, {
                status: HttpStatus.SUCCESS,
                admin: AdminEntity.publicFields(adminEntity)
            });
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async forgotPassword(forgotPasswordDTO: ForgotPasswordDTO) {
        try {
            if (forgotPasswordDTO.appName !== APP_NAME.SHERIFF_PORTAL_APP) {
                return HttpResponse.create(HttpStatusCode.NOT_AUTHORIZED, {
                    status: HttpStatus.ERROR,
                    message: HttpMessages.INVALID_APP_NAME,
                    reload: true
                });
            }

            if (!AuthInfraService.verifyPortalAppVersion(forgotPasswordDTO.appVersion)) {
                return HttpResponse.create(HttpStatusCode.NOT_AUTHORIZED, {
                    status: HttpStatus.ERROR,
                    message: HttpMessages.VERSION_MISMATCH,
                    reload: true
                });
            }

            const searchFilters = AdminFilter.setFilter({
                email: forgotPasswordDTO.email,
                adminTypes: [
                    SHERIFF_OFFICE_ACCESS_ROLES.SHERIFF_OFFICE_READER,
                    SHERIFF_OFFICE_ACCESS_ROLES.SHERIFF_OFFICE_WRITER,
                    SHERIFF_OFFICE_ACCESS_ROLES.SHERIFF_OFFICE_CONFIDENTIAL
                ]
            });
            const admin = await this.adminRepository.fetch(searchFilters);
            if (!admin) {
                return HttpResponse.notFound({message: HttpMessages.INVALID_EMAIL});
            }

            const adminEntity = AdminEntity.create(admin);

            adminEntity.resetPasswordToken = SharedUtils.generateUuid();
            await this.adminRepository.update({adminId: adminEntity.adminId}, adminEntity);
            await emailUtils.forgotPasswordEmail({
                admin: adminEntity,
                resetPasswordLink: APP_URLS.PORTAL_RESET_PASSWORD_URL,
                appName: APP_NAME.SHERIFF_PORTAL_APP
            });

            return HttpResponse.ok({message: HttpMessages.RESET_TOKEN_SENT});
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
        const searchFilters = AdminFilter.setFilter({
            resetPasswordToken: resetPasswordDTO.resetPasswordToken,
            adminTypes: [
                SHERIFF_OFFICE_ACCESS_ROLES.SHERIFF_OFFICE_READER,
                SHERIFF_OFFICE_ACCESS_ROLES.SHERIFF_OFFICE_WRITER,
                SHERIFF_OFFICE_ACCESS_ROLES.SHERIFF_OFFICE_CONFIDENTIAL
            ]
        });
        const admin = await this.adminRepository.fetch(searchFilters);
        if (!admin) {
            return HttpResponse.notFound({message: HttpMessages.INVALID_RESET_TOKEN});
        }

        const adminEntity = AdminEntity.create(admin);

        const comparePassword = await AuthInfraService.verifyUserCredentials(
            resetPasswordDTO.password,
            adminEntity.password
        );
        if (comparePassword) {
            return HttpResponse.error({
                message: HttpMessages.DUPLICATE_PASSWORD
            });
        }

        adminEntity.password = await AuthInfraService.encryptPassword(resetPasswordDTO.password);
        adminEntity.resetPasswordToken = null as never;
        adminEntity.loginTries = 0;
        adminEntity.passwordResetOn = SharedUtils.getCurrentDate({});
        await this.adminRepository.update({adminId: adminEntity.adminId}, adminEntity);

        return HttpResponse.ok({message: HttpMessages.PASSWORD_RESET_SUCCESS});
    }

    async logout(adminId) {
        if (adminId) {
            await this.adminRepository.update(
                {adminId: adminId},
                {
                    sessionId: null
                }
            );
        }

        return HttpResponse.noContent();
    }
}

export default AuthUserService;
