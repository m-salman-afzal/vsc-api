import {inject, injectable} from "tsyringe";

import {AdminEntity} from "@entities/Admin/AdminEntity";
import {AuditLogEntity} from "@entities/AuditLog/AuditLogEntity";
import {RoleEntity} from "@entities/Role/RoleEntity";

import {BUCKETS} from "@constants/CloudStorageConstant";
import {REPOSITORIES} from "@constants/FileConstant";

import {ORDER_BY, SHERIFF_OFFICE_ACCESS_ROLES} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import AdminFilter from "@repositories/Shared/ORM/AdminFilter";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {cloudStorageUtils} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddAuditLogDto} from "./DTOs/AddAuditLogDto";
import type {GetAuditLogDto} from "./DTOs/GetAuditLogDto";
import type {SearchAuditLogDto} from "./DTOs/SearchAuditLogDto";
import type {IAdminRepository} from "@entities/Admin/IAdminRepository";
import type {IAuditLogRepository, TOrder} from "@entities/AuditLog/IAuditLogRepository";
import type {AuditLog} from "@infrastructure/Database/Models/AuditLog";
import type {PaginationDto} from "@infraUtils/PaginationDto";
import type {TSearchFilters} from "@typings/ORM";

@injectable()
export class AuditLogService {
    constructor(
        @inject("IAuditLogRepository") private auditLogRepository: IAuditLogRepository,
        @inject("IAdminRepository") private adminRepository: IAdminRepository
    ) {}

    async fetchPaginatedWithAdminPatient(
        searchFilters: TSearchFilters<AuditLog>,
        pagination: PaginationOptions,
        order?: TOrder
    ) {
        return this.auditLogRepository.fetchPaginatedWithAdminFacility(searchFilters, pagination, order);
    }

    async addAuditLog(addAuditLogDto: AddAuditLogDto) {
        try {
            const auditLogEntity = AuditLogEntity.create(addAuditLogDto);

            auditLogEntity.auditLogId = SharedUtils.shortUuid();
            auditLogEntity.data = JSON.stringify(addAuditLogDto.data);
            await this.auditLogRepository.create(auditLogEntity);

            return auditLogEntity;
        } catch (error) {
            return await ErrorLog(error);
        }
    }

    async searchAuditLogs(searchAuditLogDTO: SearchAuditLogDto, paginationDto: PaginationDto) {
        try {
            const {text, ...searchAuditLog} = searchAuditLogDTO;

            const pagination = PaginationOptions.create(paginationDto);

            const adminFilters = AdminFilter.setFilter(searchAuditLog);

            let admins = await this.adminRepository.fetchPaginated(
                adminFilters,
                {firstName: ORDER_BY.ASC, lastName: ORDER_BY.ASC},
                pagination
            );
            if (!admins) {
                return HttpResponse.notFound();
            }

            admins = admins.filter((admin) => !SHERIFF_OFFICE_ACCESS_ROLES.includes(admin.adminType));

            const count = await this.adminRepository.count(adminFilters);

            return HttpResponse.ok(
                PaginationData.getPaginatedData(
                    pagination,
                    count,
                    admins.map((al) => {
                        return {
                            entity: AdminEntity.publicFields(al)
                        };
                    })
                )
            );
        } catch (error) {
            return HttpResponse.error({message: await ErrorLog(error)});
        }
    }

    async getAuditLogs(getAuditLogDTO: GetAuditLogDto, paginationDto: PaginationDto) {
        try {
            const {sort, ...newGetAuditLogDTO} = getAuditLogDTO;

            const pagination = PaginationOptions.create(paginationDto);

            const isAuditLogs = await this.fetchPaginatedWithAdminPatient(newGetAuditLogDTO, pagination, sort);

            if (!isAuditLogs) {
                return HttpResponse.notFound();
            }

            const auditLogEntity: any = [];

            for (const al of isAuditLogs.rows) {
                const publicAdmin = AdminEntity.publicFields(al.admin);
                publicAdmin.role = al.admin.adminRole.map((adminRole) => RoleEntity.create(adminRole.role));

                if (al.entity === "InventoryControl") {
                    const data = JSON.parse(al.data);
                    data.receiverSignature =
                        data.receiverSignature &&
                        (await cloudStorageUtils.generateV4ReadSignedUrl(
                            BUCKETS.FCH,
                            `${REPOSITORIES.INVENTORY_CONTROL}/${data.receiverSignature}`
                        ));

                    data.witnessSignature =
                        data.witnessSignature &&
                        (await cloudStorageUtils.generateV4ReadSignedUrl(
                            BUCKETS.FCH,
                            `${REPOSITORIES.INVENTORY_CONTROL}/${data.witnessSignature}`
                        ));

                    const dataWithSignedUrl = JSON.stringify(data);

                    auditLogEntity.push({
                        auditLog: {...AuditLogEntity.create({...al, data: dataWithSignedUrl}), createdAt: al.createdAt},
                        admin: publicAdmin
                    });
                } else {
                    auditLogEntity.push({
                        auditLog: {...AuditLogEntity.create(al), createdAt: al.createdAt},
                        admin: publicAdmin
                    });
                }
            }

            return HttpResponse.ok(PaginationData.getPaginatedData(pagination, isAuditLogs.count, auditLogEntity));
        } catch (error) {
            return HttpResponse.error({message: await ErrorLog(error)});
        }
    }
}
