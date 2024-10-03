import type {IDiscrepancyLogEntity} from "@entities/DiscrepancyLog/DiscrepancyLogEntity";

type TGetDiscrepancyLogDto = Partial<
    Pick<IDiscrepancyLogEntity, "facilityId" | "type"> & {
        fromDate: string;
        toDate: string;
        name: string;
    }
>;

export interface GetDiscrepancyLogDto extends TGetDiscrepancyLogDto {}

export class GetDiscrepancyLogDto {
    constructor(body: TGetDiscrepancyLogDto) {
        this.facilityId = body.facilityId as string;
        this.name = body.name as string;
        this.type = body.type as string;
        this.fromDate = body.fromDate as string;
        this.toDate = body.toDate as string;
    }

    static create(body: unknown) {
        return new GetDiscrepancyLogDto(body as TGetDiscrepancyLogDto);
    }
}
