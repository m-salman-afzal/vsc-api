import async from "async";
import {inject, injectable} from "tsyringe";

import {ControlledDrugEntity} from "@entities/ControlledDrug/ControlledDrugEntity";
import {PerpetualInventoryEntity} from "@entities/PerpetualInventory/PerpetualInventoryEntity";

import {REPOSITORIES} from "@constants/FileConstant";

import HttpResponse from "@appUtils/HttpResponse";

import {BaseService} from "@application/BaseService";
import {AddNotificationDto} from "@application/Notification/DTOs/AddNotificationDTO";
import {AddNotificationAdminDto} from "@application/NotificationAdmins/DTOs/AddNotificationAdminDTO";

import {
    adminService,
    notificationAdminService,
    notificationService,
    perpetualInventoryService
} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {RemoveControlledDrugDto} from "./Dtos/RemoveControlledDrugDto";
import type {UpdateControlledDrugDto} from "./Dtos/UpdateControlledDrugDto";
import type {IControlledDrugRepository} from "@entities/ControlledDrug/IControlledDrugRepository";
import type {ControlledDrug} from "@infrastructure/Database/Models/ControlledDrug";

@injectable()
export class ControlledDrugService extends BaseService<ControlledDrug, ControlledDrugEntity> {
    constructor(@inject("IControlledDrugRepository") controlledDrugRepository: IControlledDrugRepository) {
        super(controlledDrugRepository);
    }

    async updateControlledDrug(updateControlledDrugDto: UpdateControlledDrugDto) {
        try {
            const isControlledDrug = await this.fetch({controlledDrugId: updateControlledDrugDto.controlledDrugId});
            if (!isControlledDrug) {
                return HttpResponse.notFound();
            }

            const controlledDrugEntity = ControlledDrugEntity.create({...isControlledDrug, ...updateControlledDrugDto});
            await this.update({controlledDrugId: updateControlledDrugDto.controlledDrugId}, controlledDrugEntity);
            const perpetualInventory = await perpetualInventoryService.fetchAll(
                {
                    controlledDrugId: controlledDrugEntity.controlledDrugId,
                    isPatientSpecific: false
                },
                {}
            );
            if (perpetualInventory && perpetualInventory?.length > 0) {
                await async.eachSeries(perpetualInventory, async (pI) => {
                    const perpetualEntity = PerpetualInventoryEntity.create({
                        ...pI,
                        controlledId: controlledDrugEntity.controlledId,
                        tr: controlledDrugEntity.tr
                    });
                    await perpetualInventoryService.updateSinglePerpetualInventory(perpetualEntity);
                });
            }

            return HttpResponse.ok(controlledDrugEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async removeControlledDrug(removeControlledDrugDto: RemoveControlledDrugDto) {
        try {
            const isControlledDrug = await this.fetch({controlledDrugId: removeControlledDrugDto.controlledDrugId});
            if (!isControlledDrug) {
                return HttpResponse.notFound();
            }
            await this.remove({controlledDrugId: removeControlledDrugDto.controlledDrugId});
            this.subAddControlledDrugNotification({
                ...removeControlledDrugDto,
                notificationType: "CONTROLLED_DRUG_DELETE"
            });

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subAddControlledDrugNotification(props: {
        controlledDrugId: string;
        facilityId: string;
        notificationType: string;
    }) {
        const perpetualInventory = await perpetualInventoryService.fetchAll(
            {
                controlledDrugId: props.controlledDrugId,
                isPatientSpecific: false
            },
            {}
        );
        if (!perpetualInventory) {
            return;
        }
        const admins = await adminService.fetchAllByQueryWithRoleServiceList({
            facilityId: props.facilityId,
            permission: "WRITE",
            serviceName: "PERPETUALINVENTORY"
        });

        if (!admins) {
            return;
        }
        const notificationEntity = await notificationService.subAddNotification(
            AddNotificationDto.create({
                repository: REPOSITORIES.CONTROLLED_DRUG,
                repositoryId: props.controlledDrugId,
                type: props.notificationType,
                facilityId: props.facilityId
            })
        );

        const isNotification = await notificationService.subGetNotification({
            notificationId: notificationEntity.notificationId
        });
        if (!isNotification) {
            return;
        }
        await async.eachSeries(admins, async (admin) => {
            try {
                await notificationAdminService.subAddNotificationAdmin(
                    isNotification,
                    AddNotificationAdminDto.create({
                        notificationId: isNotification.notificationId,
                        adminId: admin.adminId
                    })
                );
            } catch (error) {
                ErrorLog(error);
            }
        });
    }

    async getSingleControlledDrugById(searchBy: {id?: number; controlledDrugId?: string}) {
        const controlledDrug = searchBy.id
            ? await this.fetch({id: searchBy.id})
            : await this.fetch({controlledDrugId: searchBy.controlledDrugId as string});
        if (!controlledDrug) {
            return false;
        }

        return ControlledDrugEntity.create(controlledDrug);
    }
}
