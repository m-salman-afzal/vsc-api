import z from "zod";

import {RoleValidationSchema} from "@validations/Schemas/RoleValidationSchema";

export class RoleValidation {
    static addRoleValidation(body: unknown) {
        const role = RoleValidationSchema.required({
            name: true,
            defaultPermission: true,
            colorCode: true
        });

        return role.parse(body);
    }

    static getRoleValidation(body: unknown) {
        const role = RoleValidationSchema.partial({
            roleId: true,
            name: true,
            position: true,
            colorCode: true
        });

        return role.parse(body);
    }

    static updateRoleValidation(body: unknown) {
        const role = z.array(
            RoleValidationSchema.required({roleId: true}).partial({
                name: true,
                position: true,
                colorCode: true
            })
        );

        return role.parse(body);
    }

    static removeRoleValidation(body: unknown) {
        const role = RoleValidationSchema.required({roleId: true});

        return role.parse(body);
    }
}
