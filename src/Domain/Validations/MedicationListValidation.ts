import {MedicationListValidationSchema} from "./Schemas/MedicationListValidationSchema";

export class MedicationListValidation {
    static getMedicationList(body: unknown) {
        const getMedicationList = MedicationListValidationSchema.required({
            facilityId: true,
            dateFrom: true,
            dateTo: true
        });

        return getMedicationList.parse(body);
    }

    static getMedicationListLastUpdate(body: unknown) {
        const getMedicationList = MedicationListValidationSchema.required({
            facilityId: true
        });

        return getMedicationList.parse(body);
    }

    static downloadMedicationList(body: unknown) {
        const getMedicationList = MedicationListValidationSchema.required({
            facilityId: true,
            medicationListId: true
        });

        return getMedicationList.parse(body);
    }
}
