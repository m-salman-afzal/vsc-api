import type {ISafeReportEventLocationEntity} from "@entities/SafeReportEventLocation/SafeReportEventLocationEntity";

export type TSafeReportEventLocation = {
    description: string;
    location: string;
};
type IUpdateSafeReportEventLocationDto = Partial<
    Pick<ISafeReportEventLocationEntity, "safeReportId" | "safeReportEventLocationId"> & {
        safeEventLocationId?: string | string[];
        safeReportEventLocation?: TSafeReportEventLocation[];
    }
>;

export interface UpdateSafeReportEventLocationDto extends IUpdateSafeReportEventLocationDto {}

export class UpdateSafeReportEventLocationDto {
    private constructor(body: IUpdateSafeReportEventLocationDto) {
        this.safeReportEventLocationId = body.safeReportEventLocationId as string;
        this.safeReportId = body.safeReportId as string;
        this.safeEventLocationId = body.safeEventLocationId as string | string[];
        this.safeReportEventLocation = body.safeReportEventLocation as TSafeReportEventLocation[];
    }

    static create(body: unknown) {
        return new UpdateSafeReportEventLocationDto(body as IUpdateSafeReportEventLocationDto);
    }
}
