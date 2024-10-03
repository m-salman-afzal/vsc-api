export interface IAdminRoleEntity {
    adminRoleId: string;
    adminId: string;
    roleId: string;
}

export interface AdminRoleEntity extends IAdminRoleEntity {}

export class AdminRoleEntity {
    constructor(body: IAdminRoleEntity) {
        this.adminRoleId = body.adminRoleId;
        this.adminId = body.adminId;
        this.roleId = body.roleId;
    }

    static create(body: unknown) {
        return new AdminRoleEntity(body as IAdminRoleEntity);
    }
}
