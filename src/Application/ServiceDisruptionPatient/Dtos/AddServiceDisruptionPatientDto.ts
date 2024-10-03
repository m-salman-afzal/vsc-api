import type {IServiceDisruptionPatientEntity} from "@entities/ServiceDisruptionPatient/ServiceDisruptionPatientEntity";

type TAddServiceDisruptionPatientDto = Pick<
    IServiceDisruptionPatientEntity,
    "patientName" | "patientNumber" | "time" | "comments" | "delayPeriod" | "serviceDisruptionId"
>;

export interface AddServiceDisruptionPatientDto extends TAddServiceDisruptionPatientDto {}

export class AddServiceDisruptionPatientDto {
    constructor(body: TAddServiceDisruptionPatientDto) {
        this.patientName = body.patientName;
        this.patientNumber = body.patientNumber;
        this.time = body.time;
        this.comments = body.comments;
        this.delayPeriod = body.delayPeriod;
        this.serviceDisruptionId = body.serviceDisruptionId;
    }

    static create(body: unknown) {
        return new AddServiceDisruptionPatientDto(body as TAddServiceDisruptionPatientDto);
    }
}
