import {inject, injectable} from "tsyringe";

import {AdminEntity} from "@entities/Admin/AdminEntity";

import {APP_NAME, LOGIN_TYPE, SHERIFF_OFFICE_ACCESS_ROLES} from "@constants/AuthConstant";

import {APP_URLS, ORDER_BY} from "@appUtils/Constants";
import {HttpMessages} from "@appUtils/Http";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import AdminFilter from "@repositories/Shared/ORM/AdminFilter";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import AuthInfraService from "@infraServices/AuthInfraService";

import {redisClient} from "@infrastructure/Database/RedisConnection";
import {emailUtils} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddAdminDto} from "./Dtos/AddAdminDto";
import type {GetAdminDto} from "./Dtos/GetAdminDto";
import type {RemoveAdminDto} from "./Dtos/RemoveAdminDto";
import type {UpdateAdminDto} from "./Dtos/UpdateAdminDto";
import type {UpdateAdminPasswordDto} from "./Dtos/UpdateAdminPasswordDto";
import type {UpdateAdminProfileDto} from "./Dtos/UpdateAdminProfileDto";
import type {ValidateAdminPasswordDto} from "./Dtos/ValidateAdminPasswordDto";
import type {IAdminRepository} from "@entities/Admin/IAdminRepository";
import type {PaginationDto} from "@infraUtils/PaginationDto";

const {SHERIFF_OFFICE_READER, SHERIFF_OFFICE_WRITER, SHERIFF_OFFICE_CONFIDENTIAL} = SHERIFF_OFFICE_ACCESS_ROLES;

@injectable()
class AdminService {
    constructor(@inject("IAdminRepository") private adminRepository: IAdminRepository) {}

    async getAdmins(getAdminDto: GetAdminDto, paginationDto: PaginationDto) {
        try {
            const searchFilters = AdminFilter.setFilter({
                ...getAdminDto,
                adminTypes: [SHERIFF_OFFICE_READER, SHERIFF_OFFICE_WRITER, SHERIFF_OFFICE_CONFIDENTIAL]
            });
            const pagination = PaginationOptions.create(paginationDto);
            const adminUsers = await this.adminRepository.fetchPaginated(searchFilters, {id: ORDER_BY.ASC}, pagination);
            if (!adminUsers) {
                return HttpResponse.notFound();
            }

            const adminUsersCount = await this.adminRepository.count(searchFilters);
            const adminUserEntities = adminUsers.map((ad) => AdminEntity.publicFields(ad));

            return HttpResponse.ok(PaginationData.getPaginatedData(pagination, adminUsersCount, adminUserEntities));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async addAdminUser(addAdminDto: AddAdminDto) {
        try {
            const searchFilters = AdminFilter.setFilter({
                email: addAdminDto.email
            });
            const isAdmin = await this.adminRepository.fetch(searchFilters);
            if (isAdmin) {
                return HttpResponse.conflict();
            }

            const isDeletedAdmin = await this.adminRepository.fetchWithDeleted(searchFilters);
            if (isDeletedAdmin) {
                await this.adminRepository.restore({adminId: isDeletedAdmin.adminId});
            }

            const adminEntity = AdminEntity.create(addAdminDto);
            adminEntity.adminId = isDeletedAdmin ? isDeletedAdmin.adminId : SharedUtils.shortUuid();
            adminEntity.resetPasswordToken = SharedUtils.generateUuid();
            adminEntity.loginType = LOGIN_TYPE.PASSWORD;
            await this.adminRepository.upsert(adminEntity, {email: adminEntity.email});

            await emailUtils.adminRegistrationEmail({
                admin: adminEntity,
                resetPasswordLink: APP_URLS.PORTAL_RESET_PASSWORD_URL,
                appName: APP_NAME.SHERIFF_PORTAL_APP
            });

            return HttpResponse.created(AdminEntity.publicFields(adminEntity));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async updateAdminUser(updateAdminDto: UpdateAdminDto) {
        try {
            const searchFilters = AdminFilter.setFilter({
                adminId: updateAdminDto.adminId as string,
                adminTypes: [SHERIFF_OFFICE_READER, SHERIFF_OFFICE_WRITER, SHERIFF_OFFICE_CONFIDENTIAL]
            });

            const isAdmin = await this.adminRepository.fetch(searchFilters);

            if (!isAdmin) {
                return HttpResponse.notFound();
            }
            const adminEntity = AdminEntity.create({...isAdmin, ...updateAdminDto});
            await this.adminRepository.update({adminId: updateAdminDto.adminId as string}, adminEntity);

            if (isAdmin.adminType !== updateAdminDto.adminType && adminEntity.sessionId) {
                await redisClient.del(`fchSession:${isAdmin.sessionId}`);
                await this.adminRepository.update(
                    {adminId: updateAdminDto.adminId as string},
                    {
                        sessionId: null
                    }
                );
            }

            return HttpResponse.ok(AdminEntity.publicFields(adminEntity));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async removeAdminUser(removeAdminDto: RemoveAdminDto) {
        try {
            const searchFilters = AdminFilter.setFilter({
                adminId: removeAdminDto.adminId as string,
                adminTypes: [SHERIFF_OFFICE_READER, SHERIFF_OFFICE_WRITER, SHERIFF_OFFICE_CONFIDENTIAL]
            });

            const isAdmin = await this.adminRepository.fetch(searchFilters);
            if (!isAdmin) {
                return HttpResponse.notFound();
            }

            const adminEntity = AdminEntity.create(isAdmin);
            await redisClient.del(`fchSession:${adminEntity.sessionId}`);
            await this.adminRepository.remove(searchFilters);

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async updateAdminProfile(DtoAdminProfile: UpdateAdminProfileDto) {
        try {
            const searchFilters = AdminFilter.setFilter({
                adminId: DtoAdminProfile.adminId,
                adminTypes: [SHERIFF_OFFICE_READER, SHERIFF_OFFICE_WRITER, SHERIFF_OFFICE_CONFIDENTIAL]
            });

            const isAdmin = await this.adminRepository.fetch(searchFilters);

            if (!isAdmin) {
                return HttpResponse.notFound();
            }

            const adminEntity = AdminEntity.create({...isAdmin, ...DtoAdminProfile});
            await this.adminRepository.update({adminId: DtoAdminProfile.adminId}, adminEntity);

            return HttpResponse.ok(AdminEntity.publicFields(adminEntity));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async updateAdminPassword(DtoAdminPassword: UpdateAdminPasswordDto) {
        try {
            const searchFilters = AdminFilter.setFilter({
                adminId: DtoAdminPassword.adminId,
                adminTypes: [SHERIFF_OFFICE_READER, SHERIFF_OFFICE_WRITER, SHERIFF_OFFICE_CONFIDENTIAL]
            });

            const isAdmin = await this.adminRepository.fetch(searchFilters);

            if (!isAdmin) {
                return HttpResponse.notFound();
            }

            const isAdminEntity = AdminEntity.create(isAdmin);

            const comparePassword = await AuthInfraService.verifyUserCredentials(
                DtoAdminPassword.password as string,
                isAdminEntity.password
            );

            if (comparePassword) {
                return HttpResponse.error({
                    message: HttpMessages.DUPLICATE_PASSWORD
                });
            }

            const adminEntity = AdminEntity.create({...isAdminEntity, ...DtoAdminPassword});

            adminEntity.password = await AuthInfraService.encryptPassword(DtoAdminPassword.password as string);
            adminEntity.passwordResetOn = SharedUtils.getCurrentDate({});

            await this.adminRepository.update({adminId: DtoAdminPassword.adminId}, adminEntity);

            return HttpResponse.ok(AdminEntity.publicFields(adminEntity));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async validateAdminUserPassword(DtoValidateAdminPassword: ValidateAdminPasswordDto) {
        try {
            const searchFilters = AdminFilter.setFilter({
                adminId: DtoValidateAdminPassword.adminId,
                adminTypes: [SHERIFF_OFFICE_READER, SHERIFF_OFFICE_WRITER, SHERIFF_OFFICE_CONFIDENTIAL]
            });

            const isAdmin = await this.adminRepository.fetch(searchFilters);

            if (!isAdmin) {
                return HttpResponse.notFound();
            }

            const adminEntity = AdminEntity.create(isAdmin);

            const comparePassword = await AuthInfraService.verifyUserCredentials(
                DtoValidateAdminPassword.password as string,
                adminEntity.password
            );

            if (!comparePassword) {
                return HttpResponse.error({
                    message: HttpMessages.INVALID_PASSWORD
                });
            }

            return HttpResponse.ok(AdminEntity.publicFields(adminEntity));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}

export default AdminService;
