import type {IServiceDependencyEntity} from "@entities/ServiceDependency/ServiceDependencyEntity";

export type TRbacDependencyCheckOutput = IServiceDependencyEntity & {
    checkFailed: boolean;
    roleId: string;
};

export type TRbacDependencyCheckOutputGrouped = Omit<
    IServiceDependencyEntity,
    "serviceDependsOnId" | "minimumPermissinDependsOn"
> & {
    checkFailed: boolean;
    roleId: string;
    serviceDependsOnIds?: {
        serviceDependsOnId: string;
        minimumPermissionDependsOn: string;
    }[];
};
