import async from "async";
import {inject, injectable} from "tsyringe";

import {FacilityAdminEntity} from "@entities/FacilityAdmin/FacilityAdminEntity";
import {UserSettingEntity} from "@entities/UserSetting/UserSettingEntity";

import {ORDER_BY} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {AddNotificationAdminDto} from "@application/NotificationAdmins/DTOs/AddNotificationAdminDTO";

import FacilityAdminFilter from "@repositories/Shared/ORM/FacilityAdminFilter";

import {
    adminService,
    facilityChecklistService,
    notificationAdminService,
    notificationService
} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddFacilityAdminDTO} from "./DTOs/AddFacilityAdminDTO";
import type {GetFacilityAdminDTO} from "./DTOs/GetFacilityAdminDTO";
import type {RemoveFacilityAdminDTO} from "./DTOs/RemoveFacilityAdminDTO";
import type {UpdateFacilityAdminDTO} from "./DTOs/UpdateFacilityAdminDTO";
import type {IFacilityAdminRepository} from "@entities/FacilityAdmin/IFacilityAdminRepository";
import type {IUserSettingRepository} from "@entities/UserSetting/IUserSettingRepository";
import type {FacilityAdmin} from "@infrastructure/Database/Models/FacilityAdmin";

@injectable()
export class FacilityAdminService {
    constructor(
        @inject("IFacilityAdminRepository") private facilityAdminRepository: IFacilityAdminRepository,
        @inject("IUserSettingRepository") private userSettingRepository: IUserSettingRepository
    ) {}

    async subAddFacilityAdmin(addFacilityAdminDTO: AddFacilityAdminDTO) {
        const searchFilters = FacilityAdminFilter.setFilter(addFacilityAdminDTO);
        const isFacilityAdmin = await this.facilityAdminRepository.fetch(searchFilters);
        if (isFacilityAdmin) {
            return false;
        }

        const facilityAdminEntity = FacilityAdminEntity.create(addFacilityAdminDTO);
        facilityAdminEntity.facilityAdminId = SharedUtils.shortUuid();
        await this.facilityAdminRepository.create(facilityAdminEntity);

        const isNotification = await notificationService.fetch({
            facilityId: addFacilityAdminDTO.facilityId
        });

        const isFacilityChecklistComplete = await facilityChecklistService.isFacilityChecklistComplete({
            facilityId: addFacilityAdminDTO.facilityId
        });

        if (isNotification) {
            await notificationAdminService.subAddNotificationAdmin(
                isNotification,
                AddNotificationAdminDto.create({
                    notificationId: isNotification.notificationId,
                    adminId: facilityAdminEntity.adminId,
                    isRead: isFacilityChecklistComplete,
                    isArchived: isFacilityChecklistComplete
                })
            );
        }

        return facilityAdminEntity;
    }

    async addFacilityAdmin(addFacilityAdminDTO: AddFacilityAdminDTO) {
        try {
            const facilityAdminEntity = await this.subAddFacilityAdmin(addFacilityAdminDTO);
            if (!facilityAdminEntity) {
                return HttpResponse.conflict();
            }

            return HttpResponse.created(FacilityAdminEntity.create(facilityAdminEntity));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subGetFacilityAdmins(getFacilityAdminDTO: GetFacilityAdminDTO) {
        const searchFilters = FacilityAdminFilter.setFilter(getFacilityAdminDTO);
        const facilityAdmins = await this.facilityAdminRepository.fetchAll(searchFilters, {id: ORDER_BY.DESC});
        if (!facilityAdmins) {
            return false;
        }

        return facilityAdmins;
    }

    async subRemoveFacilityAdmin(removeFacilityAdminDTO: RemoveFacilityAdminDTO) {
        const searchFilters = FacilityAdminFilter.setFilter(removeFacilityAdminDTO);

        const isFacilityAdmin = await this.facilityAdminRepository.fetch(searchFilters);
        if (!isFacilityAdmin) {
            return false;
        }

        const admins = await adminService.fetchBySearchQuery({
            adminId: isFacilityAdmin.adminId
        });
        if (!admins) {
            return HttpResponse.notFound();
        }

        const isUserSetting = await this.userSettingRepository.fetch({
            adminId: isFacilityAdmin.adminId
        });

        if (!isUserSetting) {
            return HttpResponse.notFound();
        }

        const userSettingEntity = UserSettingEntity.create({...isUserSetting});

        const {setting}: {setting: object} = userSettingEntity;

        if (
            setting &&
            "defaultFacilityId" in setting &&
            setting.defaultFacilityId === isFacilityAdmin.facilityId &&
            admins.length > 1
        ) {
            userSettingEntity.setting = {
                defaultFacilityId: (
                    admins.find((admin) => (admin as any).facilityId !== isFacilityAdmin.facilityId) as any
                )?.facilityId
            } as never;
            await this.userSettingRepository.update(
                {userSettingId: userSettingEntity.userSettingId},
                userSettingEntity
            );
        }

        return await this.facilityAdminRepository.remove(searchFilters);
    }

    async removeFacilityAdmin(removeFacilityAdminDTO: RemoveFacilityAdminDTO) {
        try {
            const isFacilityAdminRemoved = await this.subRemoveFacilityAdmin(removeFacilityAdminDTO);
            if (!isFacilityAdminRemoved) {
                HttpResponse.notFound();
            }

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subGetFacilityAdminsWithDeleted(searchBy: {
        facilityId?: string;
        adminId?: string;
        externalFacilityId?: string;
    }) {
        const searchFilters = FacilityAdminFilter.setFilter(searchBy);
        const facilityAdmins = await this.facilityAdminRepository.fetchAllWithDeleted(searchFilters);
        if (!facilityAdmins) {
            return false;
        }

        return facilityAdmins;
    }

    async subRestoreFacilityAdmin(searchBy: {facilityId?: string; adminId?: string; externalFacilityId?: string}) {
        const searchFilters = FacilityAdminFilter.setFilter(searchBy);
        const facilityAdmin = await this.facilityAdminRepository.restore(searchFilters);
        if (!facilityAdmin) {
            return false;
        }

        return facilityAdmin;
    }

    async subUpdateFacilityAdmins(updateFacilityAdminDTO: UpdateFacilityAdminDTO) {
        const isDeletedFacilityAdmins = await this.subGetFacilityAdminsWithDeleted({
            adminId: updateFacilityAdminDTO.adminId as string
        });
        if (!isDeletedFacilityAdmins) {
            return false;
        }

        const restoredFacilityAdmins = await this.toBeRestored(isDeletedFacilityAdmins, updateFacilityAdminDTO);

        const isFacilityAdmins = isDeletedFacilityAdmins.filter((facilityAdmins) => !facilityAdmins.deletedAt);
        const facilityIds = isFacilityAdmins.map((facilityAdmin) => {
            return facilityAdmin.facilityId;
        });

        await this.toBeRemoved(facilityIds, updateFacilityAdminDTO);

        await this.toBeAdded(facilityIds, updateFacilityAdminDTO, restoredFacilityAdmins);

        return true;
    }

    private async toBeRestored(deletedFacilityAdmins: FacilityAdmin[], updateFacilityAdminDTO: UpdateFacilityAdminDTO) {
        const facilityAdminsToBeRestored = deletedFacilityAdmins.filter(
            (facilityAdmin) =>
                facilityAdmin.deletedAt && updateFacilityAdminDTO.facilityId?.includes(facilityAdmin.facilityId)
        );
        await async.eachSeries(facilityAdminsToBeRestored, async (facilityAdmin) => {
            try {
                await this.subRestoreFacilityAdmin({
                    adminId: updateFacilityAdminDTO.adminId as string,
                    facilityId: facilityAdmin.facilityId
                });
            } catch (error) {
                ErrorLog(error);
            }
        });

        return facilityAdminsToBeRestored;
    }

    private async toBeRemoved(facilityIds: string[], updateFacilityAdminDTO: UpdateFacilityAdminDTO) {
        const facilityIdsToBeRemoved = facilityIds.filter(
            (facilityId) => !updateFacilityAdminDTO.facilityId?.includes(facilityId)
        );
        await async.eachSeries(facilityIdsToBeRemoved, async (facilityId) => {
            try {
                await this.subRemoveFacilityAdmin({
                    adminId: updateFacilityAdminDTO.adminId as string,
                    facilityId: facilityId
                });
            } catch (error) {
                ErrorLog(error);
            }
        });
    }

    private async toBeAdded(
        facilityIds: string[],
        updateFacilityAdminDTO: UpdateFacilityAdminDTO,
        restoredFacilityAdmins: FacilityAdmin[]
    ) {
        const facilityIdsToBeAdded = (updateFacilityAdminDTO.facilityId as string[]).filter(
            (facilityId) =>
                !facilityIds.includes(facilityId) && !restoredFacilityAdmins?.find((fa) => fa.facilityId === facilityId)
        );
        await async.eachSeries(facilityIdsToBeAdded, async (facilityId) => {
            try {
                await this.subAddFacilityAdmin({
                    adminId: updateFacilityAdminDTO.adminId as string,
                    facilityId: facilityId
                });
            } catch (error) {
                ErrorLog(error);
            }
        });
    }
}
