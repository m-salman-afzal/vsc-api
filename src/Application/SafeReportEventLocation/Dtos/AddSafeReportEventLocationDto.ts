import type {ISafeReportEventLocationEntity} from "@entities/SafeReportEventLocation/SafeReportEventLocationEntity";

type IAddSafeReportEventLocationDto = Omit<ISafeReportEventLocationEntity, "safeReportEventLocationId">;

export interface AddSafeReportEventLocationDto extends IAddSafeReportEventLocationDto {}

export class AddSafeReportEventLocationDto {
    private constructor(body: IAddSafeReportEventLocationDto) {
        this.safeReportId = body.safeReportId;
        this.safeEventLocationId = body.safeEventLocationId;
        this.description = body.description;
    }

    static create(body: unknown) {
        return new AddSafeReportEventLocationDto(body as IAddSafeReportEventLocationDto);
    }
}
