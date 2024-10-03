import type {ILogEntity} from "@entities/Log/LogEntity";

type TAddLogDTO = Pick<ILogEntity, "adminId" | "logId" | "method" | "payload" | "reqUrl">;

interface AddLogDTO extends TAddLogDTO {}

class AddLogDTO {
    constructor(body: TAddLogDTO) {
        this.adminId = body.adminId;
        this.logId = body.logId;
        this.method = body.method;
        this.payload = body.payload;
    }

    static create(body: TAddLogDTO) {
        return new AddLogDTO(body);
    }
}

export default AddLogDTO;
