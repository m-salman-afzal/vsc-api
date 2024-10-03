import type {ILogEntity} from "@entities/Log/LogEntity";

type TGetLogDTO = Partial<
    Pick<ILogEntity, "method" | "adminId"> & {
        fromDate: string;
        toDate: string;
        text: string;
    }
>;

interface GetLogDTO extends TGetLogDTO {}

class GetLogDTO {
    private constructor(body: TGetLogDTO) {
        this.adminId = body.adminId as string;
        this.fromDate = body.fromDate as string;
        this.toDate = body.toDate as string;
        this.method = body.method as string;
        this.text = body.text as string;
    }

    static create(body: TGetLogDTO) {
        return new GetLogDTO(body);
    }
}

export default GetLogDTO;
