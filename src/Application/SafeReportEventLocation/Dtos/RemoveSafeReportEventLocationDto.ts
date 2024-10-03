import type {ISafeReportEventLocationEntity} from "@entities/SafeReportEventLocation/SafeReportEventLocationEntity";

type IRemoveSafeReportEventLocationDto = Partial<ISafeReportEventLocationEntity>;

export interface RemoveSafeReportEventLocationDto extends IRemoveSafeReportEventLocationDto {}

export class RemoveSafeReportEventLocationDto {
    private constructor(body: IRemoveSafeReportEventLocationDto) {
        this.safeReportEventLocationId = body.safeReportEventLocationId as string;
        this.safeReportId = body.safeReportId as string;
        this.safeEventLocationId = body.safeEventLocationId as string;
    }

    static create(body: unknown) {
        return new RemoveSafeReportEventLocationDto(body as IRemoveSafeReportEventLocationDto);
    }
}
