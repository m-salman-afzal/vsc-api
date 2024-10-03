import type {ISafeFacilityChecklistEntity} from "@entities/SafeFacilityChecklist/SafeFacilityChecklistEntity";

type IUpdateSafeFacilityChecklistDto = Partial<
    Pick<ISafeFacilityChecklistEntity, "safeReportId" | "safeFacilityChecklistId"> & {
        facilityChecklistId?: string | string[];
    }
>;

export interface UpdateSafeFacilityChecklistDto extends IUpdateSafeFacilityChecklistDto {}

export class UpdateSafeFacilityChecklistDto {
    private constructor(body: IUpdateSafeFacilityChecklistDto) {
        this.safeFacilityChecklistId = body.safeFacilityChecklistId as string;
        this.safeReportId = body.safeReportId as string;
        this.facilityChecklistId = body.facilityChecklistId as string | string[];
    }

    static create(body: unknown) {
        return new UpdateSafeFacilityChecklistDto(body as IUpdateSafeFacilityChecklistDto);
    }
}
