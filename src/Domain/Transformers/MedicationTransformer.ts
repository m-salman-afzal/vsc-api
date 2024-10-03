export interface IMedicationTransformer {
    jmsId: string;
    ndc: string;
    dosage: string | number;
    unit: string;
    facilityId: string;
}

export interface IExternalMedication {
    JMS_ID: string;
    "NDC Code of Drug ordered": string;
    LOCATION: string;
    UNIT: string;
    FACILITY_ID: string;
    Dosage: string;
}

export interface MedicationTransformer extends IMedicationTransformer {}

export class MedicationTransformer {
    constructor(medPassTransformer: IExternalMedication) {
        this.jmsId = medPassTransformer.JMS_ID;
        this.dosage = medPassTransformer.Dosage;
        this.unit = medPassTransformer.UNIT;
        this.facilityId = medPassTransformer.FACILITY_ID;
        this.ndc = medPassTransformer["NDC Code of Drug ordered"];
    }

    static create(medPassTransformer) {
        return new MedicationTransformer(medPassTransformer);
    }
}
