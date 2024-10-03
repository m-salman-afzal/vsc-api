import type {IDivisionSwornEntity} from "@entities/DivisionSworn/DivisionSwornEntity";

type TGetDivisionSwornDTO = Partial<
    Pick<IDivisionSwornEntity, "divisionSwornId" | "title" | "category" | "year" | "facilityId">
>;

interface GetDivisionSwornDTO extends TGetDivisionSwornDTO {}

class GetDivisionSwornDTO {
    constructor(body: TGetDivisionSwornDTO) {
        this.divisionSwornId = body.divisionSwornId as string;
        this.title = body.title as string;
        this.category = body.category as string;
        this.year = body.year as string;
        this.facilityId = body.facilityId as string;
    }

    static create(body: TGetDivisionSwornDTO) {
        return new GetDivisionSwornDTO(body);
    }
}

export default GetDivisionSwornDTO;
