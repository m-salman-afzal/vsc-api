import type {IFileEntity} from "@entities/File/FileEntity";

type TGetFileDto = Partial<
    Omit<IFileEntity, "info"> & {
        currentPage: number;
        perPage: number;
        fromDate: string;
        toDate: string;
        text: string;
        firstName: string;
        lastName: string;
    }
>;

export interface GetFileDto extends TGetFileDto {}

export class GetFileDto {
    constructor(body: TGetFileDto) {
        if (body.text) {
            const [firstName, lastName] = body.text.split(" ");
            this.firstName = firstName as string;
            this.lastName = lastName as string;
        }

        this.fileName = body.fileName as string;
        this.fileExtension = body.fileExtension as string;
        this.repository = body.repository as string;
        this.process = body.process as string;
        this.status = body.status as string;
        this.isEf = body.isEf ? body.isEf === ("true" as never) : (null as never);
        this.adminId = body.adminId as string;
        this.facilityId = body.facilityId as string;
        this.currentPage = body.currentPage as number;
        this.perPage = body.perPage as number;
        this.fromDate = body.fromDate as string;
        this.toDate = body.toDate as string;
    }

    static create(body: TGetFileDto) {
        return new GetFileDto(body);
    }
}
