export interface IBridgeTherapyLogEntity {
    bridgeTherapyLogId: string;
    filename: string;
    adminId: string;
    facilityId: string;
}

export interface BridgeTherapyLogEntity extends IBridgeTherapyLogEntity {}

export class BridgeTherapyLogEntity {
    constructor(bridgeTherapyLogEntity: IBridgeTherapyLogEntity) {
        this.bridgeTherapyLogId = bridgeTherapyLogEntity.bridgeTherapyLogId;
        this.filename = bridgeTherapyLogEntity.filename
            ? bridgeTherapyLogEntity.filename.trim()
            : bridgeTherapyLogEntity.filename;
        this.adminId = bridgeTherapyLogEntity.adminId;
        this.facilityId = bridgeTherapyLogEntity.facilityId;
    }

    static create(bridgeTherapyLogEntity) {
        return new BridgeTherapyLogEntity(bridgeTherapyLogEntity);
    }
}
