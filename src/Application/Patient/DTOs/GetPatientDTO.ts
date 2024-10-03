import type {IPatientEntity} from "@entities/Patient/PatientEntity";

type TGetPatientDTO = Partial<
    Pick<IPatientEntity, "facilityId" | "externalPatientId" | "jmsId" | "status"> & {
        searchText: string;
        toDate: string;
        fromDate: string;
        lastBookedDate: string;
    }
>;

export interface GetPatientDTO extends TGetPatientDTO {}

export class GetPatientDTO {
    constructor(body: TGetPatientDTO) {
        this.facilityId = body.facilityId as string;
        this.externalPatientId = body.externalPatientId as string;
        this.jmsId = body.jmsId as string;
        this.status = body.status as string;
        this.searchText = body.searchText as string;
        this.toDate = body.toDate as string;
        this.fromDate = body.fromDate as string;
        this.lastBookedDate = body.lastBookedDate as string;
    }

    static create(body: TGetPatientDTO) {
        return new GetPatientDTO(body);
    }
}
