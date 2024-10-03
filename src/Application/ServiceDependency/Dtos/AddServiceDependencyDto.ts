import type {IServiceDependencyEntity} from "@entities/ServiceDependency/ServiceDependencyEntity";

type TAddServiceDependencyDto = Omit<IServiceDependencyEntity, "serviceDependencyId">;

export interface AddServiceDependencyDto extends TAddServiceDependencyDto {}

export class AddServiceDependencyDto {
    private constructor(body: TAddServiceDependencyDto) {
        this.serviceListId = body.serviceListId;
        this.minimumPermission = body.minimumPermission;
        this.dependencyOrRelationGroupId = body.dependencyOrRelationGroupId;
        this.serviceDependsOnId = body.serviceDependsOnId;
        this.minimumPermissionDependsOn = body.minimumPermissionDependsOn;
    }

    static create(body: unknown) {
        return new AddServiceDependencyDto(body as TAddServiceDependencyDto);
    }
}
