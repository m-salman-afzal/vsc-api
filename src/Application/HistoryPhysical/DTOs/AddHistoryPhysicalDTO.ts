import type {IHistoryPhysicalEntity} from "@entities/HistoryPhysical/HistoryPhysicalEntity";

type TAddHistoryPhysicalDTO = Pick<
    IHistoryPhysicalEntity,
    "patientName" | "patientNumber" | "location" | "dob" | "age" | "isYearly" | "historyPhysicalId" | "facilityId"
> &
    Partial<Pick<IHistoryPhysicalEntity, "annualDate" | "initialDate" | "lastBooked">>;

export interface AddHistoryPhysicalDTO extends TAddHistoryPhysicalDTO {}

export class AddHistoryPhysicalDTO {
    constructor(body: TAddHistoryPhysicalDTO) {
        this.patientName = body.patientName;
        this.patientNumber = body.patientNumber;
        this.location = body.location;
        this.dob = body.dob;
        this.age = body.age;
        this.facilityId = body.facilityId;
        this.annualDate = body.annualDate as string;
        this.initialDate = body.initialDate as string;
        this.lastBooked = body.lastBooked as string;
    }

    static create(body: TAddHistoryPhysicalDTO) {
        return new AddHistoryPhysicalDTO(body);
    }
}
