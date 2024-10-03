type TDownloadMedicationListDTO = {
    facilityId: string;
    medicationListId: string;
};

export interface DownloadMedicationListDTO extends TDownloadMedicationListDTO {}

export class DownloadMedicationListDTO {
    private constructor(body: TDownloadMedicationListDTO) {
        this.facilityId = body.facilityId;
        this.medicationListId = body.medicationListId;
    }

    static create(body: TDownloadMedicationListDTO): DownloadMedicationListDTO {
        return new DownloadMedicationListDTO(body);
    }
}
