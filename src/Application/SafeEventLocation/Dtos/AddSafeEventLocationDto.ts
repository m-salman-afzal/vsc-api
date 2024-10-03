import type {ISafeEventLocationEntity} from "@entities/SafeEventLocation/SafeEventLocationEntity";

type IAddSafeEventLocationDto = Omit<ISafeEventLocationEntity, "safeEventLocationId">;

export interface AddSafeEventLocationDto extends IAddSafeEventLocationDto {}

export class AddSafeEventLocationDto {
    private constructor(body: IAddSafeEventLocationDto) {
        this.location = body.location;
    }

    static create(body: unknown) {
        return new AddSafeEventLocationDto(body as IAddSafeEventLocationDto);
    }
}
