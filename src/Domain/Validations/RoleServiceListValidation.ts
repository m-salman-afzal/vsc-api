import z from "zod";

import {RoleServiceListValidationSchema} from "@validations/Schemas/RoleServiceListValidationSchema";
import {ServiceListValidationSchema} from "@validations/Schemas/ServiceListValidationSchema";

import {RoleValidationSchema} from "./Schemas/RoleValidationSchema";

export class RoleServiceListValidation {
    static addRoleServiceListValidation(body: unknown) {
        const roleService = RoleServiceListValidationSchema.required({
            roleId: true,
            roleServiceListId: true,
            permission: true
        });

        return roleService.parse(body);
    }

    static getRoleServiceListValidation(body: unknown) {
        const roleService = RoleServiceListValidationSchema.partial({
            roleServiceListId: true,
            roleId: true,
            serviceListId: true,
            permission: true
        });

        return roleService.parse(body);
    }

    static updateRoleServiceListValidation(body: unknown) {
        const roleService = z.array(
            RoleValidationSchema.merge(
                z.object({
                    roleServiceList: z.array(
                        RoleServiceListValidationSchema.merge(
                            z.object({
                                serviceList: ServiceListValidationSchema.partial({
                                    serviceListId: true,
                                    name: true
                                })
                            })
                        ).partial({
                            roleServiceListId: true,
                            roleId: true,
                            serviceListId: true,
                            permission: true,
                            serviceList: true
                        })
                    )
                })
            ).partial({
                roleId: true,
                position: true,
                name: true,
                roleServiceList: true
            })
        );

        return roleService.parse(body);
    }

    static removeRoleServiceListValidation(body: unknown) {
        const roleService = RoleServiceListValidationSchema.required({roleServiceListId: true});

        return roleService.parse(body);
    }
}
