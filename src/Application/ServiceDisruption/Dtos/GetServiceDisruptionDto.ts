import type {IServiceDisruptionEntity} from "@entities/ServiceDisruption/ServiceDisruptionEntity";

type TGetServiceDisruptionDto = Partial<
    Pick<IServiceDisruptionEntity, "serviceDisruptionId" | "date" | "time" | "service" | "reason" | "facilityId">
>;

export interface GetServiceDisruptionDto extends TGetServiceDisruptionDto {}

export class GetServiceDisruptionDto {
    constructor(body: TGetServiceDisruptionDto) {
        this.serviceDisruptionId = body.serviceDisruptionId as string;
        this.date = body.date as string;
        this.time = body.time as string;
        this.service = body.service as string;
        this.reason = body.reason as string;
        this.facilityId = body.facilityId as string;
    }

    static create(body: unknown) {
        return new GetServiceDisruptionDto(body as TGetServiceDisruptionDto);
    }
}
