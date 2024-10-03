export interface ILogEntity {
    logId: string;
    reqUrl: string;
    method: string;
    payload: string;
    adminId: string;
}

interface LogEntity extends ILogEntity {}

class LogEntity {
    constructor(logEntity: ILogEntity) {
        this.logId = logEntity.logId;
        this.method = logEntity.method;
        this.payload = logEntity.payload;
        this.reqUrl = logEntity.reqUrl;
        this.adminId = logEntity.adminId;
    }

    static create(logEntity) {
        return new LogEntity(logEntity);
    }
}

export default LogEntity;
