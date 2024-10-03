import {ServiceDependencyValidationSchema} from "@validations/Schemas/ServiceDependencyValidationSchema";

export class ServiceDependencyValidation {
    static addServiceDependencyValidation(body: unknown) {
        const service = ServiceDependencyValidationSchema.required({
            serviceListId: true,
            serviceDependsOnId: true,
            minimumPermission: true,
            minimumPermissionDependsOn: true
        }).partial({
            dependencyOrRelationGroupId: true
        });

        return service.parse(body);
    }
}
