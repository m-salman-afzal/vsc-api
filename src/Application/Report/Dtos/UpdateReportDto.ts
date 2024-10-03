import {UpdateSafeReportDto} from "@application/SafeReport/Dtos/UpdateSafeReportDto";

import type {IReportEntity} from "@entities/Report/ReportEntity";

type TSafeReportEventLocation = {description: string; location: string}[];

type TUpdateReportDto = Partial<Omit<IReportEntity, "safeReportId">> &
    Partial<{
        safeReport: UpdateSafeReportDto;
        safeReportEventLocation: TSafeReportEventLocation;
        safeFacilityChecklist: string[];
        safeAssignmentComment: string;
        isSenderEdit: boolean;
    }>;

export interface UpdateReportDto extends TUpdateReportDto {}

export class UpdateReportDto {
    constructor(body: TUpdateReportDto) {
        this.reportId = body.reportId as string;
        this.isAnonymous = body.isAnonymous as boolean;
        this.type = body.type as string;
        this.description = body.description as string;
        this.adminId = body.adminId as string;
        this.facilityId = body.facilityId as string;
        this.status = body.status as string;
        this.safeReport = body.safeReport ? UpdateSafeReportDto.create(body.safeReport) : (undefined as never);
        this.safeReportEventLocation = body.safeReportEventLocation
            ? (body.safeReportEventLocation.map((srel) => ({
                  description: srel.description,
                  location: srel.location
              })) as TSafeReportEventLocation)
            : (undefined as never);
        this.safeFacilityChecklist = body.safeFacilityChecklist as string[];
        this.safeAssignmentComment = body.safeAssignmentComment as string;
        this.isSenderEdit = body.isSenderEdit as boolean;
    }

    static create(body: unknown) {
        return new UpdateReportDto(body as UpdateReportDto);
    }
}
