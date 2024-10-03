import {z} from "zod";

import {stringValidation} from "./ValidationTypes";

export const ServiceDependencyValidationSchema = z
    .object({
        serviceListId: stringValidation,
        serviceDependsOnId: stringValidation,
        minimumPermission: stringValidation,
        minimumPermissionDependsOn: stringValidation,
        dependencyOrRelationGroupId: stringValidation
    })
    .partial();
