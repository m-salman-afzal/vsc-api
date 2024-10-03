export interface IRoleEntity {
    roleId: string;
    name: string;
    position: number;
    colorCode: string;
}

export interface RoleEntity extends IRoleEntity {}

export class RoleEntity {
    constructor(body: IRoleEntity) {
        this.roleId = body.roleId;
        this.position = body.position;
        this.name = body.name ? body.name.trim() : body.name;
        this.colorCode = body.colorCode;
    }

    static create(body: unknown) {
        return new RoleEntity(body as IRoleEntity);
    }
}
