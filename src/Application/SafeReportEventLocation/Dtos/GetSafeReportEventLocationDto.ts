import type {ISafeReportEventLocationEntity} from "@entities/SafeReportEventLocation/SafeReportEventLocationEntity";

type IGetSafeReportEventLocationDto = Partial<ISafeReportEventLocationEntity>;

export interface GetSafeReportEventLocationDto extends IGetSafeReportEventLocationDto {}
export class GetSafeReportEventLocationDto {
    private constructor(body: IGetSafeReportEventLocationDto) {
        this.safeReportEventLocationId = body.safeReportEventLocationId as string;
        this.safeEventLocationId = body.safeEventLocationId as string;
        this.safeReportId = body.safeReportId as string;
    }

    static create(body: unknown) {
        return new GetSafeReportEventLocationDto(body as IGetSafeReportEventLocationDto);
    }
}
