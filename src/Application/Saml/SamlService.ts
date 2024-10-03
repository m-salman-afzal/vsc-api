import {inject, injectable} from "tsyringe";

import {HttpStatus, HttpStatusCode} from "@appUtils/Http";
import HttpResponse from "@appUtils/HttpResponse";

import {redisClient} from "@infrastructure/Database/RedisConnection";

import {ErrorLog} from "@logger/ErrorLog";

import type {AdminEntity} from "@entities/Admin/AdminEntity";
import type {IAdminRepository} from "@entities/Admin/IAdminRepository";
import type {TRequest} from "@src/typings/Express";

@injectable()
export class SamlService {
    constructor(@inject("IAdminRepository") private adminRepository: IAdminRepository) {}

    async login(request: TRequest) {
        try {
            if (request.isAuthenticated()) {
                const {adminEntity, rbac} = request.user as unknown as {adminEntity: AdminEntity; rbac: object};

                const sessionKey = `fchSession:${adminEntity.sessionId}`;
                const isSessionActive = await redisClient.exists(sessionKey);
                if (isSessionActive) {
                    await redisClient.del(sessionKey);
                }

                adminEntity.sessionId = request.session.id;
                const newAdminEntity = {...adminEntity};
                delete newAdminEntity.facility;
                delete newAdminEntity.userSetting;
                delete newAdminEntity.role;

                await this.adminRepository.update({adminId: adminEntity.adminId}, newAdminEntity);

                return HttpResponse.create(HttpStatusCode.OK, {
                    status: HttpStatus.SUCCESS,
                    admin: {...adminEntity, rbac: rbac}
                });
            }

            return HttpResponse.notAuthorized();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
