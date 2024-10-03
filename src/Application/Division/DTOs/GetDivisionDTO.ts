import type {IDivisionEntity} from "@entities/Division/DivisionEntity";

type TGetDivisionDTO = Partial<
    Pick<IDivisionEntity, "divisionId" | "title" | "watch" | "year" | "divisionType" | "facilityId">
>;

interface GetDivisionDTO extends TGetDivisionDTO {}

class GetDivisionDTO {
    constructor(body: TGetDivisionDTO) {
        this.divisionId = body.divisionId as string;
        this.title = body.title as string;
        this.watch = body.watch as string;
        this.year = body.year as string;
        this.divisionType = body.divisionType as string;
        this.facilityId = body.facilityId as string;
    }

    static create(body: TGetDivisionDTO) {
        return new GetDivisionDTO(body);
    }
}

export default GetDivisionDTO;
