export interface ISafeEventLocationEntity {
    safeEventLocationId: string;
    location: string;
}

export interface SafeEventLocationEntity extends ISafeEventLocationEntity {}

export class SafeEventLocationEntity {
    constructor(body: ISafeEventLocationEntity) {
        this.safeEventLocationId = body.safeEventLocationId;
        this.location = body.location ? body.location.trim() : body.location;
    }

    static create(body: unknown) {
        return new SafeEventLocationEntity(body as ISafeEventLocationEntity);
    }
}
