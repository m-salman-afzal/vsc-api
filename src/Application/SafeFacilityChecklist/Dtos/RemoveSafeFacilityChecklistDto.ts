import type {ISafeFacilityChecklistEntity} from "@entities/SafeFacilityChecklist/SafeFacilityChecklistEntity";

type IRemoveSafeFacilityChecklistDto = Partial<ISafeFacilityChecklistEntity>;

export interface RemoveSafeFacilityChecklistDto extends IRemoveSafeFacilityChecklistDto {}

export class RemoveSafeFacilityChecklistDto {
    private constructor(body: IRemoveSafeFacilityChecklistDto) {
        this.safeFacilityChecklistId = body.safeFacilityChecklistId as string;
        this.safeReportId = body.safeReportId as string;
        this.facilityChecklistId = body.facilityChecklistId as string;
    }

    static create(body: unknown) {
        return new RemoveSafeFacilityChecklistDto(body as IRemoveSafeFacilityChecklistDto);
    }
}
