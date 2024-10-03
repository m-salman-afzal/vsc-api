import {AddSafeReportDto} from "@application/SafeReport/Dtos/AddSafeReportDto";

import type {IReportEntity} from "@entities/Report/ReportEntity";

type TSafeReportEventLocation = {description: string; location: string}[];
export type TSafeReport = AddSafeReportDto & {
    safeReportEventLocation: TSafeReportEventLocation;
    safeFacilityChecklist: string[];
};

type TAddReportDto = Omit<IReportEntity, "reportId" | "safeReportId"> &
    Partial<{
        safeReport: TSafeReport;
    }>;

export interface AddReportDto extends TAddReportDto {}

export class AddReportDto {
    constructor(body: TAddReportDto) {
        this.isAnonymous = body.isAnonymous;
        this.type = body.type;
        this.description = body.description;
        this.adminId = body.adminId;
        this.facilityId = body.facilityId;

        this.safeReport = body.safeReport
            ? {
                  ...AddSafeReportDto.create(body.safeReport),
                  safeReportEventLocation: body.safeReport.safeReportEventLocation
                      ? (body.safeReport.safeReportEventLocation.map((srel) => ({
                            description: srel.description,
                            location: srel.location
                        })) as TSafeReportEventLocation)
                      : (undefined as never),
                  safeFacilityChecklist: body.safeReport.safeFacilityChecklist as string[]
              }
            : (undefined as never);
    }

    static create(body: unknown) {
        return new AddReportDto(body as AddReportDto);
    }
}
