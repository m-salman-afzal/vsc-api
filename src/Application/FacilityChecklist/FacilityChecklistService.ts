import async from "async";
import {inject, injectable} from "tsyringe";

import {AdminEntity} from "@entities/Admin/AdminEntity";
import {FacilityEntity} from "@entities/Facility/FacilityEntity";
import {FacilityChecklistEntity} from "@entities/FacilityChecklist/FacilityChecklistEntity";
import {RoleServiceListEntity} from "@entities/RoleServiceList/RoleServiceListEntity";

import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {
    adminService,
    notificationAdminService,
    notificationService,
    webSocketService
} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddFacilityChecklistDTO} from "./DTOs/AddFacilityCheclistDTO";
import type {GetFacilityChecklistDTO} from "./DTOs/GetFacilityChecklistDTO";
import type {GetFacilityChecklistSuggestionDTO} from "./DTOs/GetFacilityChecklistSuggestionDTO";
import type {IFacilityRepository} from "@entities/Facility/IFacilityRepository";
import type {IFacilityChecklistRepository} from "@entities/FacilityChecklist/IFacilityChecklistRepository";
import type {NotificationAdminEntity} from "@entities/NotificationAdmin/NotificationAdminEntity";
import type {FacilityChecklist} from "@infrastructure/Database/Models/FacilityChecklist";
import type {PaginationDto} from "@infraUtils/PaginationDto";
import type {TSearchFilters} from "@typings/ORM";

@injectable()
export class FacilityChecklistService extends BaseService<FacilityChecklist, FacilityChecklistEntity> {
    constructor(
        @inject("IFacilityChecklistRepository") private facilityChecklistRepository: IFacilityChecklistRepository,
        @inject("IFacilityRepository") private facilityRepository: IFacilityRepository
    ) {
        super(facilityChecklistRepository);
    }

    async fetchByQuery(searchFilters: TSearchFilters<FacilityChecklist>) {
        return await this.facilityChecklistRepository.fetchByQuery(searchFilters);
    }

    async subUpdateNotfication(facilityChecklistDto: AddFacilityChecklistDTO) {
        const isFacilityChecklistComplete = await this.isFacilityChecklistComplete({
            facilityId: facilityChecklistDto.facilityId
        });

        const searchFilters = {
            facilityId: facilityChecklistDto.facilityId
        };

        const notificationAdminEntities = await notificationAdminService.subGetNotificationAdmins(searchFilters);
        if (!notificationAdminEntities) {
            return false;
        }

        const notificationEntity = await notificationService.subGetNotification({
            notificationId: (notificationAdminEntities[0] as NotificationAdminEntity).notificationId
        });

        await async.eachSeries(notificationAdminEntities, async (notificationAdminEntity) => {
            const previousIsRead = notificationAdminEntity.isRead;

            notificationAdminEntity.isArchived = isFacilityChecklistComplete;
            notificationAdminEntity.isRead = isFacilityChecklistComplete;

            await notificationAdminService.update(
                {
                    notificationAdminId: notificationAdminEntity.notificationAdminId
                },
                notificationAdminEntity
            );

            if (!previousIsRead && isFacilityChecklistComplete) {
                await webSocketService.sendNotificationStatsEvent({
                    isFacilityChecklistComplete: true,
                    notificationAdminId: notificationAdminEntity.notificationAdminId,
                    adminId: notificationAdminEntity.adminId
                });

                return;
            }

            if (!previousIsRead && !isFacilityChecklistComplete) {
                return;
            }

            if (!isFacilityChecklistComplete) {
                await webSocketService.sendNotificationStatsEvent({
                    ...notificationEntity,
                    ...notificationAdminEntity,
                    adminId: notificationAdminEntity.adminId
                });
            }
        });

        return true;
    }

    async addFacilityChecklist(facilityChecklistDto: AddFacilityChecklistDTO) {
        try {
            if (facilityChecklistDto.facilityChecklist) {
                const dtoList = facilityChecklistDto.facilityChecklist;
                const facilityChecklistEntities: FacilityChecklistEntity[] = [];
                await async.eachSeries(dtoList, async (dto) => {
                    const isFacilityChecklist = await this.fetch({
                        facilityId: dto.facilityId,
                        event: dto.event
                    });

                    const facilityChecklistEntity = FacilityChecklistEntity.create(dto);

                    facilityChecklistEntity.facilityChecklistId = isFacilityChecklist
                        ? isFacilityChecklist.facilityChecklistId
                        : SharedUtils.shortUuid();

                    await this.upsert({facilityId: dto.facilityId, event: dto.event}, facilityChecklistEntity);

                    facilityChecklistEntities.push(facilityChecklistEntity);
                });

                if (!facilityChecklistEntities.length) {
                    return HttpResponse.notFound();
                }

                await this.subUpdateNotfication(facilityChecklistDto);

                return HttpResponse.created(facilityChecklistEntities);
            }

            if (facilityChecklistDto.supplyDays) {
                await this.facilityRepository.update(
                    {facilityId: facilityChecklistDto.facilityId},
                    {supplyDays: facilityChecklistDto.supplyDays}
                );

                await this.subUpdateNotfication(facilityChecklistDto);

                return HttpResponse.created({supplyDays: facilityChecklistDto.supplyDays});
            }

            await this.facilityRepository.update(
                {facilityId: facilityChecklistDto.facilityId},
                {externalFacilityId: facilityChecklistDto.externalFacilityId ?? ""}
            );

            await this.subUpdateNotfication(facilityChecklistDto);

            return HttpResponse.created({externalFacilityId: facilityChecklistDto.externalFacilityId});
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error as Error)});
        }
    }

    async isFacilityChecklistComplete(dto: GetFacilityChecklistDTO) {
        const facilityChecklist = await this.facilityChecklistRepository.fetchByQuery({
            facilityId: dto.facilityId as string
        });

        const facility = await this.facilityRepository.fetch({
            facilityId: dto.facilityId as string
        });

        if (!facility) {
            return false;
        }

        const facilityEntity = FacilityEntity.create(facility);

        let entities;

        if (facilityChecklist) {
            entities = facilityChecklist.map((fc) => FacilityChecklistEntity.create(fc));
        }

        return !!(facilityEntity.externalFacilityId && facilityEntity.supplyDays && entities);
    }

    async subGetFacilityChecklist(dto: GetFacilityChecklistDTO) {
        const facilityChecklist = await this.facilityChecklistRepository.fetchByQuery({
            adminId: dto.adminId as string,
            facilityId: dto.facilityId as string
        });

        const facility = await this.facilityRepository.fetch({
            facilityId: dto.facilityId as string
        });

        if (!facility) {
            return false;
        }

        const facilityEntity = FacilityEntity.create(facility);

        let entities;

        if (facilityChecklist) {
            entities = facilityChecklist.map((fc) => ({
                ...FacilityChecklistEntity.create(fc),
                admin: fc.admin ? AdminEntity.publicFields(fc.admin) : null,
                roleServiceList: fc.admin
                    ? fc.admin.adminRole
                          .map((adminRole) => {
                              return adminRole.role.roleServiceList
                                  .map((roleServiceList) => {
                                      const roleServiceEntity = RoleServiceListEntity.create(roleServiceList);
                                      roleServiceEntity.name = roleServiceList.serviceList.name;

                                      return roleServiceEntity;
                                  })
                                  .filter((serviceList) => serviceList.name === "safeReportInvestigations");
                          })
                          .flat()
                    : [],
                facility: FacilityEntity.publicFields(fc.facility)
            }));
        }

        if (facilityEntity.externalFacilityId || facilityEntity.supplyDays || entities) {
            return {
                facilityChecklist: entities,
                externalFacilityId: facilityEntity.externalFacilityId,
                supplyDays: facilityEntity.supplyDays
            };
        }

        return false;
    }

    async getFacilityChecklist(dto: GetFacilityChecklistDTO) {
        try {
            const facilityChecklistEntity = await this.subGetFacilityChecklist(dto);
            if (!facilityChecklistEntity) {
                return HttpResponse.notFound();
            }

            return HttpResponse.ok(facilityChecklistEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error as Error)});
        }
    }

    async getAdminSuggestion(dto: GetFacilityChecklistSuggestionDTO, paginationDto: PaginationDto) {
        try {
            const pagination = PaginationOptions.create(paginationDto);
            const admins = await adminService.fetchPaginatedByQuery(dto, pagination);
            if (admins) {
                const adminEntities = admins.rows.map((admin) => ({
                    ...AdminEntity.publicFields(admin),
                    roleServiceList: admin.adminRole
                        .map((adminRole) => {
                            return adminRole.role.roleServiceList
                                .map((roleServiceList) => {
                                    const roleServiceEntity = RoleServiceListEntity.create(roleServiceList);
                                    roleServiceEntity.name = roleServiceList.serviceList.name;

                                    return roleServiceEntity;
                                })
                                .filter((serviceList) => serviceList.name === "safeReportInvestigations");
                        })
                        .flat()
                }));
                const paginatedAdmins = PaginationData.getPaginatedData(pagination, admins.count, adminEntities);

                return HttpResponse.ok(paginatedAdmins);
            }

            return HttpResponse.notFound();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error as Error)});
        }
    }
}
