import {DateTime} from "luxon";
import {inject, injectable} from "tsyringe";

import {AdminEntity} from "@entities/Admin/AdminEntity";
import {FacilityEntity} from "@entities/Facility/FacilityEntity";
import {RoleEntity} from "@entities/Role/RoleEntity";
import {UserSettingEntity} from "@entities/UserSetting/UserSettingEntity";

import {APP_NAME, LOGIN_TYPE} from "@constants/AuthConstant";

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
class AuthService {
    constructor(@inject("IAdminRepository") private adminRepository: IAdminRepository) {}

    async login(loginDTO: LoginDTO, request: TRequest) {
        try {
            if (!AuthInfraService.verifyAppVersion(loginDTO.appVersion)) {
                return HttpResponse.create(HttpStatusCode.NOT_AUTHORIZED, {
                    status: HttpStatus.ERROR,
                    message: HttpMessages.VERSION_MISMATCH,
                    reload: true
                });
            }
            const searchFilters = {
                email: loginDTO.email
            };
            const admin = await this.adminRepository.fetchByQuery(searchFilters);
            if (!admin) {
                return HttpResponse.notAuthorized({message: HttpMessages.INVALID_CREDS});
            }

            const adminEntity = AdminEntity.create(admin);
            if (!adminEntity.loginType || adminEntity.loginType === LOGIN_TYPE.SAML) {
                return HttpResponse.notAuthorized({message: HttpMessages.INVALID_CREDS});
            }

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
                        resetPasswordLink: APP_URLS.RESET_PASSWORD_URL,
                        appName: APP_NAME.FCH_APP
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

            adminEntity.sessionId = request.sessionID;
            await this.adminRepository.update({adminId: adminEntity.adminId}, adminEntity);

            const addedAdminEntity = AdminEntity.publicFields(admin);
            addedAdminEntity.facility = admin.facilityAdmin
                .map((facilityAdmin) => FacilityEntity.create(facilityAdmin.facility))
                .sort((a, b) => a.facilityName.localeCompare(b.facilityName));
            addedAdminEntity.userSetting = UserSettingEntity.create(admin.userSetting);
            addedAdminEntity.role = admin.adminRole.map((adminRole) => RoleEntity.create(adminRole.role));
            const rbac = SharedUtils.setRoleServiceList(admin);

            (request.session as unknown as TRequestSession).passport = {
                user: {
                    adminEntity: addedAdminEntity as AdminEntity,
                    appVersion: SERVER_CONFIG.APP_VERSION,
                    rbac: rbac
                }
            };

            return HttpResponse.create(HttpStatusCode.OK, {
                status: HttpStatus.SUCCESS,
                admin: {...addedAdminEntity, rbac: rbac}
            });
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async forgotPassword(forgotPasswordDTO: ForgotPasswordDTO) {
        try {
            if (!AuthInfraService.verifyAppVersion(forgotPasswordDTO.appVersion)) {
                return HttpResponse.create(HttpStatusCode.NOT_AUTHORIZED, {
                    status: HttpStatus.ERROR,
                    message: HttpMessages.VERSION_MISMATCH,
                    reload: true
                });
            }

            const searchFilters = AdminFilter.setFilter(forgotPasswordDTO);
            const admin = await this.adminRepository.fetch(searchFilters);
            if (!admin) {
                return HttpResponse.notFound({message: HttpMessages.INVALID_EMAIL});
            }

            const adminEntity = AdminEntity.create(admin);
            if (!adminEntity.loginType || adminEntity.loginType === LOGIN_TYPE.SAML) {
                return HttpResponse.notAuthorized({message: HttpMessages.FORGOT_PASSWORD_SAML});
            }

            adminEntity.resetPasswordToken = SharedUtils.generateUuid();
            await this.adminRepository.update({adminId: adminEntity.adminId}, adminEntity);
            await emailUtils.forgotPasswordEmail({
                admin: adminEntity,
                resetPasswordLink: APP_URLS.RESET_PASSWORD_URL,
                appName: APP_NAME.FCH_APP
            });

            return HttpResponse.ok({message: HttpMessages.RESET_TOKEN_SENT});
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
        const searchFilters = AdminFilter.setFilter(resetPasswordDTO);
        const admin = await this.adminRepository.fetch(searchFilters);
        if (!admin) {
            return HttpResponse.notFound({message: HttpMessages.INVALID_RESET_TOKEN});
        }

        const adminEntity = AdminEntity.create(admin);
        if (!adminEntity.loginType || adminEntity.loginType === LOGIN_TYPE.SAML) {
            return HttpResponse.notAuthorized({message: HttpMessages.INVALID_CREDS});
        }

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

    async logout(adminEntity: AdminEntity) {
        try {
            await this.adminRepository.update({adminId: adminEntity.adminId}, {sessionId: null});

            return HttpResponse.ok({message: HttpMessages.LOGOUT_SUCCESS});
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getAdmin(request: TRequest) {
        try {
            const {
                session: {id}
            } = request;
            const isSession = await redisClient.get(`fchSession:${id}`);

            if (!isSession) {
                return HttpResponse.notFound();
            }
            const sessionObj = JSON.parse(isSession);

            const {
                passport: {
                    user: {adminEntity, rbac}
                }
            } = sessionObj;

            return HttpResponse.ok({...adminEntity, rbac});
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}

export default AuthService;
