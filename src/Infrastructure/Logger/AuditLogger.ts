import {injectable} from "tsyringe";

import {type IAdminEntity} from "@entities/Admin/AdminEntity";
import {type IFacilityEntity} from "@entities/Facility/FacilityEntity";

import {LOG_ENTITIES} from "@constants/AuditLogConstant";

import {SHERIFF_OFFICE_ACCESS_ROLES} from "@appUtils/Constants";

import {AddAuditLogDto} from "@application/AuditLog/DTOs/AddAuditLogDto";

import {auditLogService, relationService} from "@infrastructure/DIContainer/Resolver";

let loggerAdminId: string | null;
export function setAdminId(newAdminId: string | null) {
    loggerAdminId = newAdminId;
}

let loggerFacilityId: string | null;
export function setFacilityId(newFacilityId: string | null) {
    loggerFacilityId = newFacilityId;
}

export const setLoggerEntities = (entityName: string, entity: Partial<IAdminEntity & IFacilityEntity>) => {
    switch (entityName) {
        case LOG_ENTITIES.ADMIN:
            delete entity.password;
            delete entity.passwordResetOn;
            delete entity.resetPasswordToken;
            delete entity.loginTries;

            return entity;
        case LOG_ENTITIES.FACILITY:
            delete entity.facilityId;

            return entity;

        default:
            return entity;
    }
};

@injectable()
export class AuditLogger {
    async log(entity, method: string, repository: string) {
        if ("logId" in entity) {
            return;
        }

        if (entity.auditLogId) {
            return;
        }

        if (repository === LOG_ENTITIES.ADMIN && SHERIFF_OFFICE_ACCESS_ROLES.includes(entity.adminType)) {
            return;
        }

        const entityName: string = repository;
        const data = entity;
        const itemId = `${entityName.charAt(0).toLowerCase()}${entityName.slice(1)}Id`;

        const auditLog = {
            adminId: loggerAdminId ?? null,
            facilityId: loggerFacilityId,
            action: method as string,
            entity: entityName,
            entityId: data[itemId] ?? null,
            data: setLoggerEntities(entityName, data)
        };
        const addAuditLogDto = AddAuditLogDto.create(auditLog);

        const relationResponse = await relationService.getRelations(addAuditLogDto);
        await auditLogService.addAuditLog(relationResponse);
    }
}
