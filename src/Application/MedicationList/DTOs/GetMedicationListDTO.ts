type TGetMedicationListDTO = {
    medicationListId: string;
    dateFrom: string;
    dateTo: string;
};

export interface GetMedicationListDTO extends TGetMedicationListDTO {}

export class GetMedicationListDTO {
    private constructor(body: TGetMedicationListDTO) {
        this.medicationListId = body.medicationListId;
        this.dateFrom = body.dateFrom;
        this.dateTo = body.dateTo;
    }

    static create(body: TGetMedicationListDTO): GetMedicationListDTO {
        return new GetMedicationListDTO(body);
    }
}
