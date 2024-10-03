export interface IServiceListEntity {
    serviceListId: string;
    name: string;
}

export interface ServiceListEntity extends IServiceListEntity {}

export class ServiceListEntity {
    constructor(body: IServiceListEntity) {
        this.serviceListId = body.serviceListId;
        this.name = body.name ? body.name.trim() : body.name;
    }

    static create(body: unknown) {
        return new ServiceListEntity(body as IServiceListEntity);
    }
}
