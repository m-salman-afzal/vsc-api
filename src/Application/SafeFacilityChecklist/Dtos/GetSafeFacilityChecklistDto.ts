import type {ISafeFacilityChecklistEntity} from "@entities/SafeFacilityChecklist/SafeFacilityChecklistEntity";

type IGetSafeFacilityChecklistDto = Partial<ISafeFacilityChecklistEntity>;

export interface GetSafeFacilityChecklistDto extends IGetSafeFacilityChecklistDto {}
export class GetSafeFacilityChecklistDto {
    private constructor(body: IGetSafeFacilityChecklistDto) {
        this.safeFacilityChecklistId = body.safeFacilityChecklistId as string;
        this.facilityChecklistId = body.facilityChecklistId as string;
        this.safeReportId = body.safeReportId as string;
    }

    static create(body: unknown) {
        return new GetSafeFacilityChecklistDto(body as IGetSafeFacilityChecklistDto);
    }
}
