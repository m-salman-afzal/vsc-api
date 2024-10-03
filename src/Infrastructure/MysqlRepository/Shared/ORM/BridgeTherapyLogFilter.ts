import type {IBridgeTherapyLogEntity} from "@entities/BridgeTherapyLog/BridgeTherapyLogEntity";
import type {BridgeTherapyLog} from "@infrastructure/Database/Models/BridgeTherapyLog";
import type {TWhereFilter} from "@typings/ORM";

type TFilterBridgeTherapyLog = Partial<IBridgeTherapyLogEntity> & {
    toDate?: string;
    fromDate?: string;
};

type TWhereBridgeTherapyLog = TWhereFilter<BridgeTherapyLog>;

export class BridgeTherapyLogFilter {
    private where: TWhereBridgeTherapyLog;
    constructor(filters: TFilterBridgeTherapyLog) {
        this.where = {};

        this.setBridgeTherapyLogId(filters);
        this.setAdminId(filters);
        this.setFacilityId(filters);
    }

    static setFilter(filters: TFilterBridgeTherapyLog) {
        return new BridgeTherapyLogFilter(filters).where;
    }

    setBridgeTherapyLogId(filters: TFilterBridgeTherapyLog) {
        if (filters.bridgeTherapyLogId) {
            this.where.bridgeTherapyLogId = filters.bridgeTherapyLogId;
        }
    }

    setAdminId(filters: TFilterBridgeTherapyLog) {
        if (filters.adminId) {
            this.where.adminId = filters.adminId;
        }
    }
    setFacilityId(filters: TFilterBridgeTherapyLog) {
        if (filters.facilityId) {
            this.where.facilityId = filters.facilityId;
        }
    }
}
