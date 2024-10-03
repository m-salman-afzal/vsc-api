export interface IMedPassTransformer {
    jmsId: string;
    ndc: string;
    medPassResult: string;
    quantity: string | number;
    drugName: string;
    resultedAt: string;
    externalFacilityId: string;
}

export interface IExternalMedPass {
    JMS_ID: string;
    FORMATTED_NDC: string;
    MEDPASS_RESULT: string;
    QTY_DOSE: string;
    LABEL_NAME: string;
    RESULT_DATE: string;
    FACILITY_ID: string;
}

export interface MedPassTransformer extends IMedPassTransformer {}

export class MedPassTransformer {
    constructor(medPassTransformer: IExternalMedPass) {
        this.ndc = medPassTransformer.FORMATTED_NDC;
        this.medPassResult = medPassTransformer.MEDPASS_RESULT;
        this.quantity = medPassTransformer.QTY_DOSE;
        this.drugName = medPassTransformer.LABEL_NAME;
        this.resultedAt = medPassTransformer.RESULT_DATE;
        this.externalFacilityId = medPassTransformer.FACILITY_ID;
        this.jmsId = medPassTransformer.JMS_ID;
    }

    static create(medPassTransformer) {
        return new MedPassTransformer(medPassTransformer);
    }
}
