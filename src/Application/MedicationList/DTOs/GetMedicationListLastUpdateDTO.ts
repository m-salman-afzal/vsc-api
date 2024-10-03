type TGetMedicationListLastUpdateDTO = {
    facilityId: string;
    medicationListId: string;
};

export interface GetMedicationListLastUpdateDTO extends TGetMedicationListLastUpdateDTO {}

export class GetMedicationListLastUpdateDTO {
    private constructor(body: TGetMedicationListLastUpdateDTO) {
        this.facilityId = body.facilityId;
        this.medicationListId = body.medicationListId;
    }

    static create(body: TGetMedicationListLastUpdateDTO): GetMedicationListLastUpdateDTO {
        return new GetMedicationListLastUpdateDTO(body);
    }
}
