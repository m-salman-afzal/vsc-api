type TGetDivisionReportDTO = {divisionType: string; facilityId: string; dateFrom: string; dateTo: string};
interface GetDivisionReportDTO extends TGetDivisionReportDTO {}
class GetDivisionReportDTO {
    constructor(body: TGetDivisionReportDTO) {
        this.divisionType = body.divisionType as string;
        this.facilityId = body.facilityId as string;
        this.dateFrom = body.dateFrom as string;
        this.dateTo = body.dateTo as string;
    }

    static create(body: TGetDivisionReportDTO) {
        return new GetDivisionReportDTO(body);
    }
}

export default GetDivisionReportDTO;
