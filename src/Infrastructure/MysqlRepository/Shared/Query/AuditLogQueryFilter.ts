import type {IAuditLogEntity} from "@entities/AuditLog/AuditLogEntity";
import type {AuditLog} from "@infrastructure/Database/Models/AuditLog";
import type {TQueryBuilder} from "@typings/ORM";

type TFilterAuditLog = Partial<IAuditLogEntity> & {text: string; toDate: string; fromDate: string};
type TQueryBuilderAuditLog = TQueryBuilder<AuditLog>;

export class AuditLogQueryFilter {
    private query: TQueryBuilderAuditLog;
    constructor(query: TQueryBuilderAuditLog, filters: TFilterAuditLog) {
        this.query = query;

        this.setMethod(filters);
        this.setRepository(filters);
        this.setRepositoryId(filters);
        this.setText(filters);
        this.setCreatedAt(filters);
        this.setAdminId(filters);
        this.removeEntities();
    }

    static setFilter(query: TQueryBuilderAuditLog, filters) {
        return new AuditLogQueryFilter(query, filters).query;
    }

    setMethod(filters: TFilterAuditLog) {
        if (filters.action) {
            this.query.andWhere("auditLog.action = :action", {action: filters.action});
        }
    }

    setRepository(filters: TFilterAuditLog) {
        if (filters.entity) {
            this.query.andWhere("auditLog.entity = :entity", {entity: filters.entity});
        }
    }

    setAdminId(filters: TFilterAuditLog) {
        if (filters.adminId) {
            this.query.andWhere("auditLog.adminId = :adminId", {
                adminId: filters.adminId
            });
        }
        this.query.andWhere("auditLog.adminId IS NOT NULL");
    }

    setRepositoryId(filters: TFilterAuditLog) {
        if (filters.entityId) {
            this.query.andWhere("auditLog.entityId = :entityId", {entityId: filters.entityId});
        }
    }

    setText(filters: TFilterAuditLog) {
        if (filters.text) {
            this.query.andWhere("auditLog.data LIKE :data", {data: `%${filters.text}%`});
        }
    }

    setCreatedAt(filters: TFilterAuditLog) {
        if (filters.toDate && filters.fromDate) {
            this.query.andWhere("auditLog.createdAt BETWEEN :fromDate AND :toDate", {
                fromDate: filters.fromDate,
                toDate: `${filters.fromDate} 23:59:59`
            });

            return;
        }

        if (filters.fromDate) {
            this.query.andWhere("auditLog.createdAt >= :fromDate", {fromDate: filters.fromDate});

            return;
        }

        if (filters.toDate) {
            this.query.andWhere("auditLog.createdAt <= :toDate", {toDate: filters.toDate});
        }
    }

    removeEntities() {
        this.query.andWhere("auditLog.entity != 'FacilityAdmin'");
        this.query.andWhere("auditLog.entity != 'UserSetting'");
        this.query.andWhere("auditLog.entity != 'AdminRole'");
        this.query.andWhere("auditLog.entity != 'BridgeTherapyLog'");
        this.query.andWhere("auditLog.entity != 'FormularyLevel'");
    }
}
