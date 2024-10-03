import type {IServiceDisruptionPatientEntity} from "@entities/ServiceDisruptionPatient/ServiceDisruptionPatientEntity";

type TGetServiceDisruptionPatientDto = Partial<
    Pick<
        IServiceDisruptionPatientEntity,
        "patientName" | "patientNumber" | "time" | "comments" | "delayPeriod" | "serviceDisruptionId"
    >
>;

export interface GetServiceDisruptionPatientDto extends TGetServiceDisruptionPatientDto {}

export class GetServiceDisruptionPatientDto {
    constructor(body: TGetServiceDisruptionPatientDto) {
        this.patientName = body.patientName as string;
        this.patientNumber = body.patientNumber as string;
        this.time = body.time as string;
        this.comments = body.comments as string;
        this.delayPeriod = body.delayPeriod as string;
        this.serviceDisruptionId = body.serviceDisruptionId as string;
    }

    static create(body: unknown) {
        return new GetServiceDisruptionPatientDto(body as TGetServiceDisruptionPatientDto);
    }
}
