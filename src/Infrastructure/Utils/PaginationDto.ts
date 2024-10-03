interface IPaginationDto {
    currentPage: number;
    perPage: number;
}

export interface PaginationDto extends IPaginationDto {}

export class PaginationDto {
    constructor(body: IPaginationDto) {
        this.currentPage = body.currentPage;
        this.perPage = body.perPage;
    }

    static create(body: unknown) {
        return new PaginationDto(body as IPaginationDto);
    }
}
