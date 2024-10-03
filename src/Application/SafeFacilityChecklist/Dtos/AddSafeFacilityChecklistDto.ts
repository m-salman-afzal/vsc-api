import type {ISafeFacilityChecklistEntity} from "@entities/SafeFacilityChecklist/SafeFacilityChecklistEntity";

type IAddSafeFacilityChecklistDto = Omit<ISafeFacilityChecklistEntity, "safeFacilityChecklistId">;

export interface AddSafeFacilityChecklistDto extends IAddSafeFacilityChecklistDto {}

export class AddSafeFacilityChecklistDto {
    private constructor(body: IAddSafeFacilityChecklistDto) {
        this.facilityChecklistId = body.facilityChecklistId;
        this.safeReportId = body.safeReportId;
    }

    static create(body: unknown) {
        return new AddSafeFacilityChecklistDto(body as IAddSafeFacilityChecklistDto);
    }
}
