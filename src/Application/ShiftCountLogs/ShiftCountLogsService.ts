import async from "async";
import {inject, injectable} from "tsyringe";

import {CartEntity} from "@entities/Cart/CartEntity";
import {PerpetualInventoryEntity} from "@entities/PerpetualInventory/PerpetualInventoryEntity";
import {ShiftCountLogEntity} from "@entities/ShiftCountLog/ShiftCountLogEntity";

import {PERMISSIONS} from "@constants/AuthConstant";
import {BUCKETS, FCH_BUCKET_FOLDERS} from "@constants/CloudStorageConstant";
import {REPOSITORIES} from "@constants/FileConstant";
import {SHIFT_COUNT_FOLDERS, SHIFT_COUNT_NOTIFICATION_TYPE} from "@constants/ShiftCountConstants";

import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";
import {AddDiscrepancyDto} from "@application/DiscrepancyLog/Dto/addDiscrepancyLogDto";
import {AddNotificationDto} from "@application/Notification/DTOs/AddNotificationDTO";
import {AddNotificationAdminDto} from "@application/NotificationAdmins/DTOs/AddNotificationAdminDTO";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {
    adminService,
    cloudStorageUtils,
    discrepancyLogService,
    notificationAdminService,
    notificationService,
    perpetualInventoryService,
    shiftCountLogDrugService
} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddShiftCountDiscrepancyNotificationDto} from "./Dtos/AddShiftCountDiscrepancyNotificationDto";
import type {AddShiftCountLogsDto} from "./Dtos/AddShiftCountLogsDto";
import type {GetShiftCountLogsDto} from "./Dtos/GetShiftCountLogsDto";
import type {AdminEntity} from "@entities/Admin/AdminEntity";
import type {IShiftCountLogRepository} from "@entities/ShiftCountLog/IShiftCountLogRepository";
import type {ShiftCountLogs} from "@infrastructure/Database/Models/ShiftCountLogs";
import type {PaginationDto} from "@infraUtils/PaginationDto";

@injectable()
export class ShiftCountLogsService extends BaseService<ShiftCountLogs, ShiftCountLogEntity> {
    constructor(@inject("IShiftCountLogsRepository") private shiftCountLogsRepo: IShiftCountLogRepository) {
        super(shiftCountLogsRepo);
    }

    async getShiftCountLogs(getShiftCountLogsDto: GetShiftCountLogsDto, paginationDto: PaginationDto) {
        try {
            const pagination = PaginationOptions.create(paginationDto);
            const shiftCountLogs = await this.shiftCountLogsRepo.fetchPaginatedWithCarts(
                getShiftCountLogsDto,
                pagination
            );

            if (!shiftCountLogs) {
                return HttpResponse.notFound();
            }

            const shiftCountLogEntities = shiftCountLogs.rows.map((scl) => {
                const cartEntity = CartEntity.create(scl.cart);

                return ShiftCountLogEntity.create({...scl, cartName: cartEntity.cart});
            });

            return HttpResponse.ok(
                PaginationData.getPaginatedData(pagination, shiftCountLogs.count, shiftCountLogEntities)
            );
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async addShiftCountLogs(addShiftCountLogsDto: AddShiftCountLogsDto, loggedInAdmin: AdminEntity) {
        try {
            const shiftCountLogEntity = ShiftCountLogEntity.create({
                ...addShiftCountLogsDto,
                shiftCountLogId: SharedUtils.shortUuid()
            });

            const countInv = await perpetualInventoryService.count({cartId: addShiftCountLogsDto.cartId});
            if (countInv !== addShiftCountLogsDto.shiftCountLogDrugs.length) {
                return HttpResponse.error({message: "Incorrect number of drugs"});
            }

            shiftCountLogEntity.handOffSignature = `handOffSign-${shiftCountLogEntity.shiftCountLogId}.${SharedUtils.imageExtension(shiftCountLogEntity.handOffSignature)}`;
            shiftCountLogEntity.receiverSignature = `receiverSign-${shiftCountLogEntity.shiftCountLogId}.${SharedUtils.imageExtension(shiftCountLogEntity.receiverSignature)}`;

            await cloudStorageUtils.uploadFile(
                BUCKETS.FCH,
                SharedUtils.base64Decoder(addShiftCountLogsDto.receiverSignature.split(";base64,")[1] as string),
                `${FCH_BUCKET_FOLDERS.FACILITIES}/${shiftCountLogEntity.facilityId}/${SHIFT_COUNT_FOLDERS.SHIFT_COUNT}/${shiftCountLogEntity.receiverSignature}`
            );

            await cloudStorageUtils.uploadFile(
                BUCKETS.FCH,
                SharedUtils.base64Decoder(addShiftCountLogsDto.handOffSignature.split(";base64,")[1] as string),
                `${FCH_BUCKET_FOLDERS.FACILITIES}/${shiftCountLogEntity.facilityId}/${SHIFT_COUNT_FOLDERS.SHIFT_COUNT}/${shiftCountLogEntity.handOffSignature}`
            );

            await this.create(shiftCountLogEntity);

            if (addShiftCountLogsDto.isDiscrepancy) {
                await this.subAddShiftCountDiscrepancyNotification(
                    shiftCountLogEntity,
                    SHIFT_COUNT_NOTIFICATION_TYPE.DISCREPANCY
                );

                const discrepancyDrugs = addShiftCountLogsDto.shiftCountLogDrugs
                    .filter((drug) => !!drug.perpetualInventoryId)
                    .map((drug) => {
                        return {
                            ...drug,
                            comment: shiftCountLogEntity.comment,
                            facilityId: shiftCountLogEntity.facilityId,
                            cartId: shiftCountLogEntity.cartId,
                            adminId: loggedInAdmin.adminId,
                            handOffName: shiftCountLogEntity.handOffName,
                            receiverName: shiftCountLogEntity.receiverName,
                            expectedQuantity: drug.quantityOnHand
                        };
                    });

                await async.eachSeries(discrepancyDrugs, async (drug) => {
                    try {
                        const perpetualInventoryEntity = PerpetualInventoryEntity.create({
                            perpetualInventoryId: drug.perpetualInventoryId,
                            quantityAllocated: drug.countedQuantity
                        });
                        await perpetualInventoryService.updateSinglePerpetualInventory(perpetualInventoryEntity);
                    } catch (error) {
                        await ErrorLog(error);
                    }
                });

                await discrepancyLogService.bulkAddDiscrepancies(
                    discrepancyDrugs.map((drug) =>
                        AddDiscrepancyDto.create({...drug, quantityAllocated: drug.countedQuantity})
                    )
                );
            }

            const scld = await shiftCountLogDrugService.addShiftCountLogDrugs({
                ...addShiftCountLogsDto,
                shiftCountLogId: shiftCountLogEntity.shiftCountLogId
            });

            if (!scld) {
                return HttpResponse.error({
                    message: "Error while creating Shift Count Log Drugs"
                });
            }

            return HttpResponse.created({status: "success"});
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subAddShiftCountDiscrepancyNotification(
        addNotificationDto: AddShiftCountDiscrepancyNotificationDto,
        type: string
    ) {
        const admins = await adminService.fetchAllByQueryWithRoleServiceList({
            facilityId: addNotificationDto.facilityId,
            permission: [PERMISSIONS.READ, PERMISSIONS.WRITE],
            serviceName: "shiftCountDiscrepancyNotifications"
        });

        if (!admins) {
            return;
        }
        const notificationEntity = await notificationService.subAddNotification(
            AddNotificationDto.create({
                repository: REPOSITORIES.SHIFT_COUNT_LOG,
                repositoryId: addNotificationDto.shiftCountLogId,
                type: type,
                facilityId: addNotificationDto.facilityId as string
            })
        );
        const isNotification = await notificationService.subGetNotification({
            notificationId: notificationEntity.notificationId
        });
        if (!isNotification) {
            return;
        }

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
}
