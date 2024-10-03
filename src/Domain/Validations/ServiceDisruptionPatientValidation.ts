import ServiceDisruptionPatientValidationSchema from "./Schemas/ServiceDisruptionPatientValidationSchema";

class ServiceDisruptionPatientValidation {
    static addServiceDisruptionPatientValidation(body: unknown) {
        const addServiceDisruptionPatient = ServiceDisruptionPatientValidationSchema.required({
            patientName: true,
            patientNumber: true,
            time: true,
            comments: true,
            delayPeriod: true,
            serviceDisruptionId: true
        });

        return addServiceDisruptionPatient.parse(body);
    }

    static getServiceDisruptionPatientValidation(body: unknown) {
        const getServiceDisruptionPatient = ServiceDisruptionPatientValidationSchema.partial({
            patientName: true,
            patientNumber: true,
            time: true,
            comments: true,
            delayPeriod: true,
            serviceDisruptionId: true
        });

        return getServiceDisruptionPatient.parse(body);
    }
}

export default ServiceDisruptionPatientValidation;
