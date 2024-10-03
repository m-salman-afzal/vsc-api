import {ServiceListValidationSchema} from "@validations/Schemas/ServiceListValidationSchema";

export class ServiceListValidation {
    static addServiceListValidation(body: unknown) {
        const service = ServiceListValidationSchema.required({
            name: true
        });

        return service.parse(body);
    }

    static getServiceListValidation(body: unknown) {
        const service = ServiceListValidationSchema.partial({
            serviceListId: true,
            name: true
        });

        return service.parse(body);
    }

    static updateServiceListValidation(body: unknown) {
        const service = ServiceListValidationSchema.required({serviceListId: true}).partial({
            name: true
        });

        return service.parse(body);
    }

    static removeServiceListValidation(body: unknown) {
        const service = ServiceListValidationSchema.required({serviceListId: true});

        return service.parse(body);
    }
}
