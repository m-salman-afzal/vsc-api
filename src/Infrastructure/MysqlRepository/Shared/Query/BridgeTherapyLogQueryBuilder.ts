import type {IBridgeTherapyLogEntity} from "@entities/BridgeTherapyLog/BridgeTherapyLogEntity";
import type {IPatientEntity} from "@entities/Patient/PatientEntity";
import type {BridgeTherapyLog} from "@infrastructure/Database/Models/BridgeTherapyLog";
import type {TQueryBuilder} from "@src/typings/ORM";

export type TFilterBridgeTherapyLog = Partial<IBridgeTherapyLogEntity> &
    Partial<IPatientEntity> & {
        toDate?: string;
        fromDate?: string;
        bridgeTherapyLogCreatedAt?: string;
    };

type TQueryBuilderBridgeTherapyLog = TQueryBuilder<BridgeTherapyLog>;

export class BridgeTherapyLogQueryBuilder {
    private query: TQueryBuilderBridgeTherapyLog;
    constructor(query: TQueryBuilderBridgeTherapyLog, filters: TFilterBridgeTherapyLog) {
        this.query = query;

        this.setBridgeTherapyLogId(filters);
        this.setFacilityId(filters);
        this.setAdminId(filters);
        this.setCreatedAt(filters);
    }

    static setFilter(query: TQueryBuilderBridgeTherapyLog, filters) {
        return new BridgeTherapyLogQueryBuilder(query, filters).query;
    }

    setBridgeTherapyLogId(filters: TFilterBridgeTherapyLog) {
        if (filters.bridgeTherapyLogId) {
            this.query.andWhere("bridgeTherapyLog.bridgeTherapyLogId = :bridgeTherapyLogId", {
                bridgeTherapyLogId: filters.bridgeTherapyLogId
            });
        }
    }

    setFacilityId(filters: TFilterBridgeTherapyLog) {
        if (filters.facilityId) {
            this.query.andWhere("facility.facilityId = :facilityId", {
                facilityId: filters.facilityId
            });
        }
    }

    setAdminId(filters: TFilterBridgeTherapyLog) {
        if (filters.adminId) {
            this.query.andWhere("admin.adminId = :adminId", {adminId: filters.adminId});
        }
    }

    setCreatedAt(filters: TFilterBridgeTherapyLog) {
        if (filters.bridgeTherapyLogCreatedAt) {
            this.query.andWhere("SUBSTR(bridgeTherapyLog.createdAt,1,11) LIKE :substring", {
                substring: `${filters.bridgeTherapyLogCreatedAt}%`
            });
        }
    }
}
