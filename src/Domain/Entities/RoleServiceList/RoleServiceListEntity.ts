export interface IRoleServiceListEntity {
    roleServiceListId: string;
    roleId: string;
    serviceListId: string;
    permission: string;
    name?: string;
}

export interface RoleServiceListEntity extends IRoleServiceListEntity {}

export class RoleServiceListEntity {
    constructor(body: IRoleServiceListEntity) {
        this.roleServiceListId = body.roleServiceListId;
        this.roleId = body.roleId;
        this.serviceListId = body.serviceListId;
        this.permission = body.permission;
    }

    static create(body: unknown) {
        return new RoleServiceListEntity(body as IRoleServiceListEntity);
    }
}
