import type {IPatientEntity} from "@entities/Patient/PatientEntity";

type TAddPatientDTO = Pick<
    IPatientEntity,
    | "externalPatientId"
    | "jmsId"
    | "name"
    | "location"
    | "dob"
    | "gender"
    | "status"
    | "lastBookedDate"
    | "lastReleaseDate"
>;

export interface AddPatientDTO extends TAddPatientDTO {}

export class AddPatientDTO {
    constructor(body: TAddPatientDTO) {
        this.externalPatientId = body.externalPatientId;
        this.jmsId = body.jmsId;
        this.name = body.name;
        this.location = body.location;
        this.dob = body.dob;
        this.gender = body.gender;
        this.status = body.status;
        this.lastBookedDate = body.lastBookedDate;
        this.lastReleaseDate = body.lastReleaseDate;
    }

    static create(body: TAddPatientDTO) {
        return new AddPatientDTO(body);
    }
}
