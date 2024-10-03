import {inject, injectable} from "tsyringe";

import {AdminEntity} from "@entities/Admin/AdminEntity";
import {BridgeTherapyLogEntity} from "@entities/BridgeTherapyLog/BridgeTherapyLogEntity";
import {FacilityEntity} from "@entities/Facility/FacilityEntity";
import {PatientEntity} from "@entities/Patient/PatientEntity";

import {BUCKETS, FCH_BUCKET_FOLDERS} from "@constants/CloudStorageConstant";
import {FILE_EXTENSIONS} from "@constants/FileConstant";

import {
    BRIDGE_THERAPY_FILE_NAME_PREFIX,
    BRIDGE_THERAPY_FILE_NAME_SUFFIX
} from "@domain/Constants/BridgeTherapyConstant";
import {BridgeTherapyTransformer} from "@domain/Transformers/BridgeTherapyTransformer";

import {DATE_TIME_FORMAT, ORDER_BY, TIMEZONES} from "@appUtils/Constants";
import {HttpMessages} from "@appUtils/Http";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {BridgeTherapyLogFilter} from "@repositories/Shared/ORM/BridgeTherapyLogFilter";
import {PatientFilter} from "@repositories/Shared/ORM/PatientFilter";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {
    adminService,
    cloudStorageUtils,
    facilityService,
    patientService,
    sftpClient
} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddBridgeTherapyDto} from "./Dtos/AddBridgeTherapyDto";
import type {AddBridgeTherapyLogDto} from "./Dtos/AddBridgeTherapyLogDto";
import type {DownloadBridgeTherapyLogDto} from "./Dtos/DownloadBridgeTherapyLogDto";
import type {GetBridgeTherapyAdminDto} from "./Dtos/GetBridgeTherapyAdminsDto";
import type {GetBridgeTherapyLogDto} from "./Dtos/GetBridgeTherapyLogDto";
import type {TOrder} from "@entities/AuditLog/IAuditLogRepository";
import type IBridgeTherapyLogRepository from "@entities/BridgeTherapyLog/IBridgeTherapyLogRepository";
import type {BridgeTherapyLog} from "@infrastructure/Database/Models/BridgeTherapyLog";
import type {PaginationDto} from "@infraUtils/PaginationDto";
import type {TFilterBridgeTherapyLog} from "@repositories/Shared/Query/BridgeTherapyLogQueryBuilder";

@injectable()
export class BridgeTherapyService extends BaseService<BridgeTherapyLog, BridgeTherapyLogEntity> {
    constructor(
        @inject("IBridgeTherapyLogRepository") private bridgeTherapyLogRepository: IBridgeTherapyLogRepository
    ) {
        super(bridgeTherapyLogRepository);
    }

    async fetchPaginatedBySearchQuery(
        searchFilters: TFilterBridgeTherapyLog,
        pagination: PaginationOptions,
        order: TOrder
    ) {
        return this.bridgeTherapyLogRepository.fetchPaginatedBySearchQuery(searchFilters, pagination, order);
    }

    async addBridgeTherapy(addBridgeTherapyDto: AddBridgeTherapyDto) {
        try {
            const patientIds = [...new Set(addBridgeTherapyDto.bridgeTherapy.map((bt) => bt.patientId))];
            const searchFilters = PatientFilter.setFilter({
                patientId: patientIds,
                facilityId: addBridgeTherapyDto.facilityId
            });
            const patients = await patientService.fetchAll(searchFilters, {name: ORDER_BY.ASC});
            if (!patients) {
                return HttpResponse.notFound();
            }

            const facilities = await facilityService.subGetFacilities({});
            if (!facilities) {
                return HttpResponse.notFound();
            }

            const facilityEntities = facilities.map((facility) => FacilityEntity.create(facility));
            const patientEntities = patients.map((patient) => {
                return {
                    ...PatientEntity.create(patient),
                    supplyDays: addBridgeTherapyDto.bridgeTherapy.find((bt) => bt.patientId === patient.patientId)
                        ?.supplyDays
                };
            });
            const bridgeTherapy = BridgeTherapyTransformer.create(patientEntities, facilityEntities);
            const filename = `${BRIDGE_THERAPY_FILE_NAME_PREFIX}${SharedUtils.getCurrentDate({
                format: DATE_TIME_FORMAT.YMD_HMS_ASCELLA,
                timezone: TIMEZONES.AMERICA_NEWYORK
            })}${BRIDGE_THERAPY_FILE_NAME_SUFFIX}`;

            await cloudStorageUtils.uploadFile(
                BUCKETS.FCH,
                bridgeTherapy,
                `${FCH_BUCKET_FOLDERS.SFTP}/${filename}.${FILE_EXTENSIONS.TXT}`
            );
            await sftpClient.uploadFile(bridgeTherapy, filename, FILE_EXTENSIONS.TXT);

            await this.subAddBridgeTherapyLog({
                adminId: addBridgeTherapyDto.adminId,
                facilityId: addBridgeTherapyDto.facilityId,
                filename: `${filename}.${FILE_EXTENSIONS.TXT}`
            });

            return HttpResponse.created({message: HttpMessages.BRIDGE_THERAPY_ADDED});
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getBridgeTherapyLogs(getBridgeTherapyLogDto: GetBridgeTherapyLogDto, paginationDto?: PaginationDto) {
        try {
            const searchFilters = getBridgeTherapyLogDto;
            const sort = searchFilters.sort;
            const pagination = PaginationOptions.create(paginationDto);
            const bridgeTherapyLogs = await this.fetchPaginatedBySearchQuery(searchFilters, pagination, sort);
            if (!bridgeTherapyLogs) {
                return HttpResponse.notFound();
            }

            const bridgeTherapyLogEntities = bridgeTherapyLogs.rows.map((btl) => {
                return {
                    ...BridgeTherapyLogEntity.create(btl),
                    admin: AdminEntity.publicFields(btl),
                    facility: FacilityEntity.publicFields(btl),
                    createdAt: btl.createdAt
                };
            });

            return HttpResponse.ok(
                PaginationData.getPaginatedData(pagination, bridgeTherapyLogs.count, bridgeTherapyLogEntities)
            );
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async downloadBridgeTherapyLog(downloadBridgeTherapyLogDto: DownloadBridgeTherapyLogDto) {
        try {
            const searchFilters = BridgeTherapyLogFilter.setFilter(downloadBridgeTherapyLogDto);
            const bridgeTherapyLog = await this.fetch(searchFilters);
            if (!bridgeTherapyLog) {
                return HttpResponse.notFound();
            }

            const bridgeTherapyFile = await cloudStorageUtils.getFileContent(
                BUCKETS.FCH,
                `${FCH_BUCKET_FOLDERS.SFTP}/${bridgeTherapyLog.filename}`
            );

            return HttpResponse.ok({file: bridgeTherapyFile});
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async subAddBridgeTherapyLog(addBridgeTherapyLogDto: AddBridgeTherapyLogDto) {
        const bridgeTherapyLogEntity = BridgeTherapyLogEntity.create(addBridgeTherapyLogDto);
        bridgeTherapyLogEntity.bridgeTherapyLogId = SharedUtils.shortUuid();
        await this.bridgeTherapyLogRepository.create(bridgeTherapyLogEntity);

        return bridgeTherapyLogEntity;
    }

    async getBridgeTherapyAdmins(getBridgeTherapyAdminDto: GetBridgeTherapyAdminDto) {
        try {
            const searchFilters = {
                text: getBridgeTherapyAdminDto.text,
                bridgeTherapyFacilityId: getBridgeTherapyAdminDto.facilityId
            };
            const admins = await adminService.fetchAllForBridgeTherapy(searchFilters);
            if (!admins) {
                return HttpResponse.notFound();
            }

            const adminEntities = admins.map((admin) => AdminEntity.publicFields(admin));

            return HttpResponse.ok(adminEntities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
