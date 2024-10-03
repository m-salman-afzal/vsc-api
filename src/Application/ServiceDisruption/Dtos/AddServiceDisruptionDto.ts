import type {IServiceDisruptionEntity} from "@entities/ServiceDisruption/ServiceDisruptionEntity";

type TAddServiceDisruptionDto = Partial<
    Pick<IServiceDisruptionEntity, "date" | "time" | "service" | "reason" | "adminId" | "facilityId">
>;

export interface AddServiceDisruptionDto extends TAddServiceDisruptionDto {}

export class AddServiceDisruptionDto {
    constructor(body: TAddServiceDisruptionDto) {
        this.date = body.date as string;
        this.time = body.time as string;
        this.service = body.service as string;
        this.reason = body.reason as string;
        this.adminId = body.adminId as string;
        this.facilityId = body.facilityId as string;
    }

    static create(body: unknown) {
        return new AddServiceDisruptionDto(body as TAddServiceDisruptionDto);
    }
}
