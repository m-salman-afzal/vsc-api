import type {IReportEntity} from "@entities/Report/ReportEntity";

type TGetReportDto = Partial<
    Pick<IReportEntity, "type" | "facilityId" | "adminId" | "isAnonymous" | "reportId"> & {
        fromDate: string;
        toDate: string;
        text: string;
        investigationAdminId: string;
        isNotPending: boolean;
        status: string | string[];
        firstName: string;
        lastName: string;
    }
>;

export interface GetReportDto extends TGetReportDto {}

export class GetReportDto {
    constructor(body: TGetReportDto) {
        if (body.text && body.text.split(" ").length > 1) {
            const [firstName, lastName] = body.text.split(" ");
            this.firstName = firstName as string;
            this.lastName = lastName as string;
        } else {
            this.text = body.text as string;
        }

        this.isAnonymous = body.isAnonymous ? body.isAnonymous === ("true" as never) : (null as never);
        this.adminId = body.adminId as string;
        this.status = body.status as string | string[];
        this.type = body.type as string;
        this.fromDate = body.fromDate as string;
        this.toDate = body.toDate as string;
        this.facilityId = body.facilityId as string;
        this.investigationAdminId = body.investigationAdminId as string;
        this.isNotPending = body.isNotPending ? body.isNotPending === ("true" as never) : (null as never);
        this.reportId = body.reportId as string;
    }

    static create(body: unknown) {
        return new GetReportDto(body as GetReportDto);
    }
}
