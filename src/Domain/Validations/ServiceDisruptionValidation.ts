import ServiceDisruptionValidationSchema from "@validations/Schemas/ServiceDisruptionValidationSchema";

import PaginationValidationSchema from "./Schemas/PaginationValidationSchema";

class ServiceDisruptionValidation {
    static addServiceDisruptionValidation(body: unknown) {
        const addServiceDisruption = ServiceDisruptionValidationSchema.required({
            date: true,
            time: true,
            service: true,
            reason: true,
            adminId: true
        });

        return addServiceDisruption.parse(body);
    }

    static getServiceDisruptionValidation(body: unknown) {
        const getServiceDisruption = ServiceDisruptionValidationSchema.merge(PaginationValidationSchema)
            .required({
                facilityId: true
            })
            .partial({
                date: true,
                time: true,
                service: true,
                reason: true,
                currentPage: true,
                perPage: true
            });

        return getServiceDisruption.parse(body);
    }

    static removeServiceDisruptionValidation(body: unknown) {
        const removeServiceDisruption = ServiceDisruptionValidationSchema.required({
            serviceDisruptionId: true,
            facilityId: true
        });

        return removeServiceDisruption.parse(body);
    }
}

export default ServiceDisruptionValidation;
