import async from "async";
import {inject, injectable} from "tsyringe";

import {AdminEntity} from "@entities/Admin/AdminEntity";
import {FacilityEntity} from "@entities/Facility/FacilityEntity";
import {RoleEntity} from "@entities/Role/RoleEntity";
import {UserSettingEntity} from "@entities/UserSetting/UserSettingEntity";

import {APP_NAME, LOGIN_TYPE, SHERIFF_OFFICE_ACCESS_ROLES} from "@constants/AuthConstant";

import {APP_URLS} from "@appUtils/Constants";
import {HttpMessages, HttpStatus, HttpStatusCode} from "@appUtils/Http";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import AdminFilter from "@repositories/Shared/ORM/AdminFilter";

import {redisClient} from "@infrastructure/Database/RedisConnection";
import {
    adminRoleService,
    contactService,
    emailUtils,
    facilityAdminService,
    facilityContactService,
    facilityService,
    roleService,
    userSettingService
} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddAdminDto} from "./Dtos/AddAdminDto";
import type {GetAdminDto} from "./Dtos/GetAdminDto";
import type {RemoveAdminDto} from "./Dtos/RemoveAdminDto";
import type {UpdateAdminDto} from "./Dtos/UpdateAdminDto";
import type {IAdminRepository} from "@entities/Admin/IAdminRepository";
import type {Admin} from "@infrastructure/Database/Models/Admin";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TFilterAdmin} from "@repositories/Shared/Query/AdminQueryBuilder";

@injectable()
export class AdminService extends BaseService<Admin, AdminEntity> {
    constructor(@inject("IAdminRepository") private adminRepository: IAdminRepository) {
        super(adminRepository);
    }

    async fetchByQuery(searchFilters: TFilterAdmin) {
        return await this.adminRepository.fetchByQuery(searchFilters);
    }

    async fetchAllByQuery(searchFilters: TFilterAdmin) {
        return await this.adminRepository.fetchAllByQuery(searchFilters);
    }

    async fetchAllByQueryWithRoleServiceList(searchFilters: TFilterAdmin) {
        return await this.adminRepository.fetchAllByQueryWithRoleServiceList(searchFilters);
    }

    async fetchBySearchQuery(searchFilters: TFilterAdmin) {
        return await this.adminRepository.fetchBySearchQuery(searchFilters);
    }

    async fetchPaginatedByQuery(searchFilters: TFilterAdmin, pagination: PaginationOptions) {
        return await this.adminRepository.fetchPaginatedByQuery(searchFilters, pagination);
    }

    async fetchAllCartRequestOrderedBy() {
        return await this.adminRepository.fetchAllCartRequestOrderedBy();
    }

    async fetchAllCartRequestAllocatedBy() {
        return await this.adminRepository.fetchAllCartRequestAllocatedBy();
    }

    async fetchAllForBridgeTherapy(searchFilters: TFilterAdmin) {
        return await this.adminRepository.fetchAllForBridgeTherapy(searchFilters);
    }

    async subAddAdmin(addAdminDto: AddAdminDto) {
        const searchFilters = AdminFilter.setFilter({email: addAdminDto.email});
        const isAdmin = await this.fetch(searchFilters);
        if (isAdmin) {
            return false;
        }
        const isRoles = await roleService.subGetRoles({roleId: addAdminDto.roleId});
        if (!isRoles || isRoles.length !== addAdminDto.roleId.length) {
            return HttpResponse.notFound();
        }

        const isDeletedAdmin = await this.fetchWithDeleted(searchFilters);
        if (isDeletedAdmin) {
            await this.restore({adminId: isDeletedAdmin.adminId});

            const isFacilityAdminUpdated = await facilityAdminService.subUpdateFacilityAdmins({
                adminId: isDeletedAdmin.adminId,
                facilityId: addAdminDto.facilityId
            });
            if (!isFacilityAdminUpdated) {
                return false;
            }

            const isAdminRbacUpdated = await adminRoleService.subUpdateAdminRole({
                adminId: isDeletedAdmin.adminId,
                roleId: addAdminDto.roleId
            });
            if (!isAdminRbacUpdated) {
                return false;
            }
        }

        const adminEntity = AdminEntity.create(addAdminDto);
        adminEntity.adminId = isDeletedAdmin ? isDeletedAdmin.adminId : SharedUtils.shortUuid();
        adminEntity.resetPasswordToken = SharedUtils.generateUuid();
        adminEntity.loginType = SharedUtils.isSamlVerifiedEmail(adminEntity.email)
            ? LOGIN_TYPE.SAML
            : LOGIN_TYPE.PASSWORD;
        await this.upsert({email: adminEntity.email}, adminEntity);

        if (!isDeletedAdmin) {
            const facilities = await facilityService.getFacilitiesById({
                facilityId: addAdminDto.facilityId
            });
            if (!facilities) {
                return false;
            }

            await async.eachSeries(facilities, async (facility) => {
                try {
                    await facilityAdminService.subAddFacilityAdmin({
                        adminId: adminEntity.adminId,
                        facilityId: facility.facilityId
                    });
                } catch (error) {
                    ErrorLog(error);
                }
            });

            const userSetting = {
                setting: {
                    defaultFacilityId: addAdminDto.facilityId[0]
                },
                adminId: adminEntity.adminId
            };
            const isUserSettingAdded = await userSettingService.subAddUserSetting(userSetting as never);
            if (!isUserSettingAdded) {
                return false;
            }

            const roles = await roleService.getRolesById({
                roleId: addAdminDto.roleId
            });
            if (!roles) {
                return HttpResponse.notFound();
            }

            await async.eachSeries(roles, async (role) => {
                try {
                    await adminRoleService.subAddAdminRole({
                        adminId: adminEntity.adminId,
                        roleId: role.roleId
                    });
                } catch (error) {
                    await ErrorLog(error);
                }
            });
        }

        if (adminEntity.loginType !== LOGIN_TYPE.SAML) {
            await emailUtils.adminRegistrationEmail({
                admin: adminEntity,
                resetPasswordLink: APP_URLS.RESET_PASSWORD_URL,
                appName: APP_NAME.FCH_APP
            });
        }

        const addedAdmin = await this.fetchByQuery({adminId: adminEntity.adminId});
        if (!addedAdmin) {
            return false;
        }

        const addedAdminEntity = AdminEntity.publicFields(addedAdmin);
        addedAdminEntity.facility = addedAdmin.facilityAdmin.map((facilityAdmin) =>
            FacilityEntity.create(facilityAdmin.facility)
        );
        addedAdminEntity.userSetting = UserSettingEntity.create(addedAdmin.userSetting);
        addedAdminEntity.role = addedAdmin.adminRole.map((adminRole) => RoleEntity.create(adminRole.role));

        return addedAdminEntity;
    }

    async addAdmin(addAdminDto: AddAdminDto) {
        try {
            const adminEntity = await this.subAddAdmin(addAdminDto);
            if (!adminEntity) {
                return HttpResponse.conflict();
            }

            return HttpResponse.created(adminEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subGetAdmins(getAdminDto: GetAdminDto) {
        const isAdmins = await this.fetchAllByQueryWithRoleServiceList(getAdminDto);
        if (!isAdmins) {
            return false;
        }

        return [];
    }

    async getAdmins(getAdminDto: GetAdminDto) {
        try {
            const searchFilters = {...getAdminDto, notAdminType: Object.values(SHERIFF_OFFICE_ACCESS_ROLES)};
            const admins = await this.fetchAllByQuery(searchFilters);
            if (!admins) {
                return HttpResponse.notFound();
            }

            const adminEntities = admins.map((admin) => {
                return {
                    ...AdminEntity.publicFields(admin),
                    role: admin.adminRole.map((adminRole) => RoleEntity.create(adminRole.role)),
                    facility: admin.facilityAdmin.map((facilityAdmin) => FacilityEntity.create(facilityAdmin.facility)),
                    userSetting: admin.userSetting && UserSettingEntity.create(admin.userSetting)
                };
            });

            return HttpResponse.ok(adminEntities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    getGroupedAdmins(admins: Admin[]) {
        return SharedUtils.getGroupedEntities(
            admins,
            {
                uniqueId: "adminId",
                factory: AdminEntity.publicFields
            },

            {
                uniqueId: "facilityId",
                name: "facility",
                factory: FacilityEntity.publicFields,
                isFlat: false
            },
            {
                uniqueId: "userSettingId",
                name: "userSetting",
                factory: UserSettingEntity.create,
                isFlat: true
            }
        );
    }

    private async updateAdminRole(updateAdminDto: UpdateAdminDto, admin: Admin) {
        let isRoles: RoleEntity[] | false = [];
        if (updateAdminDto.roleId) {
            isRoles = await roleService.subGetRoles({roleId: updateAdminDto.roleId});
            if (!isRoles || isRoles.length !== updateAdminDto.roleId.length) {
                return false;
            }

            const isAdminRoleUpdated = await adminRoleService.subUpdateAdminRole({
                adminId: updateAdminDto.adminId as string,
                roleId: updateAdminDto.roleId
            });
            if (!isAdminRoleUpdated) {
                return false;
            }

            if (admin.sessionId) {
                await redisClient.del(`dtucSession:${admin.sessionId}`);
                admin.sessionId = null as never;
            }
        }

        return {
            admin: admin,
            roles: isRoles
        };
    }

    async subUpdateAdmin(updateAdminDto: UpdateAdminDto, loggedInAdmin?: AdminEntity) {
        const searchFilters = updateAdminDto.adminId
            ? {adminId: updateAdminDto.adminId}
            : {id: updateAdminDto.id as number};
        const isAdmin = await this.fetch(searchFilters);
        if (!isAdmin) {
            return false;
        }

        updateAdminDto.adminId = isAdmin.adminId;

        const isContact = await contactService.fetchByQuery({adminId: updateAdminDto.adminId});
        if (isContact) {
            const facilityIds = isContact.facilityContact.filter(
                (fc) => !updateAdminDto.facilityId?.includes(fc.facilityId)
            );
            await async.eachSeries(facilityIds, async (fc) => {
                await facilityContactService.subRemoveFacilityContact({
                    facilityContactId: fc.facilityContactId,
                    contactId: fc.contactId
                });
            });
            const contact = await contactService.fetchByQuery({contactId: isContact.contactId});
            if (contact && contact.facilityContact.length === 0) {
                await contactService.subRemoveContact({contactId: contact.contactId, adminId: contact.adminId});
            }
        }

        const isFacilityAdminUpdated = await facilityAdminService.subUpdateFacilityAdmins(updateAdminDto);
        if (!isFacilityAdminUpdated) {
            return false;
        }

        if (isFacilityAdminUpdated) {
            await redisClient.del(`fchSession:${isAdmin.sessionId}`);
        }

        const isRoleUpdated = await this.updateAdminRole(updateAdminDto, isAdmin);
        if (!isRoleUpdated) {
            return false;
        }

        const adminEntity = AdminEntity.create({...isAdmin, ...isRoleUpdated.admin, ...updateAdminDto});
        await this.update({adminId: updateAdminDto.adminId}, adminEntity);

        if (loggedInAdmin && updateAdminDto.adminId === loggedInAdmin.adminId) {
            return HttpResponse.create(HttpStatusCode.NOT_AUTHORIZED, {
                status: HttpStatus.ERROR,
                message: HttpMessages.FORBIDDEN,
                reload: true
            });
        }

        const updatedAdmin = await this.fetchByQuery({adminId: updateAdminDto.adminId});
        if (!updatedAdmin) {
            return false;
        }

        if (!updateAdminDto.facilityId?.includes(updatedAdmin.userSetting.setting.defaultFacilityId)) {
            const userSetting = {
                defaultFacilityId: updatedAdmin.facilityAdmin[0]?.facilityId as string,
                adminId: adminEntity.adminId,
                userSettingId: updatedAdmin.userSetting.userSettingId
            };
            const isUserSettingAdded = await userSettingService.subUpdateUserSetting(userSetting);
            if (!isUserSettingAdded) {
                return false;
            }
        }

        const updatedAdminEntity = AdminEntity.publicFields(updatedAdmin);
        updatedAdminEntity.facility = updatedAdmin.facilityAdmin.map((facilityAdmin) =>
            FacilityEntity.create(facilityAdmin.facility)
        );
        updatedAdminEntity.userSetting = UserSettingEntity.create(updatedAdmin.userSetting);
        updatedAdminEntity.role = updatedAdmin.adminRole.map((adminRole) => RoleEntity.create(adminRole.role));

        return updatedAdminEntity;
    }

    async updateAdmin(updateAdminDto: UpdateAdminDto, loggedInAdmin?: AdminEntity) {
        try {
            const isAdminUpdated = await this.subUpdateAdmin(updateAdminDto, loggedInAdmin);
            if (!isAdminUpdated) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok(isAdminUpdated);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subRemoveAdmin(removeAdminDto: RemoveAdminDto) {
        const searchFilters = removeAdminDto.adminId
            ? {adminId: removeAdminDto.adminId as string}
            : {id: removeAdminDto.id as number};

        const isAdmin = await this.fetch(searchFilters);
        if (!isAdmin) {
            return false;
        }

        const isFacilityAdminRemoved = await facilityAdminService.subRemoveFacilityAdmin({
            adminId: isAdmin.adminId
        });
        if (!isFacilityAdminRemoved) {
            return false;
        }

        const isAdminRoleRemoved = await adminRoleService.subRemoveAdminRole({
            adminId: isAdmin.adminId
        });
        if (!isAdminRoleRemoved) {
            return false;
        }

        await contactService.subRemoveContact({adminId: removeAdminDto.adminId as string});

        await this.remove({
            adminId: isAdmin.adminId
        });

        return await redisClient.del(`fchSession:${isAdmin.sessionId}`);
    }

    async removeAdmin(removeAdminDto: RemoveAdminDto) {
        try {
            const isAdminRemoved = await this.subRemoveAdmin(removeAdminDto);
            if (!isAdminRemoved) {
                HttpResponse.notFound();
            }

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
