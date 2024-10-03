import type {PaginationDto} from "./PaginationDto";

class PaginationOptions {
    currentPage: number;
    perPage: number;
    offset: number;
    constructor(paginationDTO?: PaginationDto) {
        this.currentPage = paginationDTO && paginationDTO.currentPage ? Number(paginationDTO.currentPage) : 1;
        this.perPage = paginationDTO && paginationDTO.perPage ? Number(paginationDTO.perPage) : 10;
        this.offset = (this.currentPage - 1) * this.perPage;
    }

    static create(paginationDTO?: PaginationDto) {
        return new PaginationOptions(paginationDTO);
    }
}

export default PaginationOptions;
