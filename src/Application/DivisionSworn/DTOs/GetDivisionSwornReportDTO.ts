type TGetDivisionSwornReportDTO = {facilityId: string; dateFrom: string; dateTo: string};
interface GetDivisionSwornReportDTO extends TGetDivisionSwornReportDTO {}
class GetDivisionSwornReportDTO {
    constructor(body: TGetDivisionSwornReportDTO) {
        this.facilityId = body.facilityId as string;
        this.dateFrom = body.dateFrom as string;
        this.dateTo = body.dateTo as string;
    }

    static create(body: TGetDivisionSwornReportDTO) {
        return new GetDivisionSwornReportDTO(body);
    }
}

export default GetDivisionSwornReportDTO;
