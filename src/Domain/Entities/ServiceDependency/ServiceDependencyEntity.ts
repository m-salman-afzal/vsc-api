export interface IServiceDependencyEntity {
    serviceDependencyId: string;
    serviceListId: string;
    serviceDependsOnId: string;
    minimumPermission: string;
    minimumPermissionDependsOn: string;
    dependencyOrRelationGroupId: string;
}

export interface ServiceDependencyEntity extends IServiceDependencyEntity {}

export class ServiceDependencyEntity {
    constructor(body: IServiceDependencyEntity) {
        this.serviceListId = body.serviceListId;
        this.serviceDependsOnId = body.serviceDependsOnId;
        this.serviceDependencyId = body.serviceDependencyId;
        this.minimumPermission = body.minimumPermission;
        this.minimumPermissionDependsOn = body.minimumPermissionDependsOn;

        this.dependencyOrRelationGroupId = body.dependencyOrRelationGroupId;
    }

    static create(body: unknown) {
        return new ServiceDependencyEntity(body as IServiceDependencyEntity);
    }
}
