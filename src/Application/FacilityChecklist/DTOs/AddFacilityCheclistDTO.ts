import type {IFacilityChecklistEntity} from "@entities/FacilityChecklist/FacilityChecklistEntity";

type TFacilityChecklist = Pick<IFacilityChecklistEntity, "adminId" | "facilityId" | "event" | "priority">;

type TAddFacilityChecklistDTO = {
    facilityChecklist: TFacilityChecklist[];
    externalFacilityId: string;
    facilityId: string;
    supplyDays: number;
};

export interface AddFacilityChecklistDTO extends TAddFacilityChecklistDTO {}

export class AddFacilityChecklistDTO {
    constructor(body: TAddFacilityChecklistDTO) {
        this.facilityChecklist =
            body.facilityChecklist &&
            body.facilityChecklist.map((b) => {
                const facilityChecklist = {} as TFacilityChecklist;

                facilityChecklist.event = b.event;
                facilityChecklist.adminId = b.adminId;
                facilityChecklist.facilityId = b.facilityId;
                facilityChecklist.priority = b.priority;

                return facilityChecklist;
            });
        this.externalFacilityId = body.externalFacilityId;
        this.facilityId = body.facilityId;
        this.supplyDays = body.supplyDays;
    }

    static create(body: TAddFacilityChecklistDTO): AddFacilityChecklistDTO {
        return new AddFacilityChecklistDTO(body);
    }
}
