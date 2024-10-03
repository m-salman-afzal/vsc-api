import type {IServiceListEntity} from "@entities/ServiceList/ServiceListEntity";

type TUpdateServiceListDto = Pick<IServiceListEntity, "serviceListId"> &
    Partial<Omit<IServiceListEntity, "serviceListId">>;

export interface UpdateServiceListDto extends TUpdateServiceListDto {}

export class UpdateServiceListDto {
    private constructor(body: TUpdateServiceListDto) {
        this.serviceListId = body.serviceListId;
        this.name = body.name as string;
    }

    static create(body: unknown) {
        return new UpdateServiceListDto(body as TUpdateServiceListDto);
    }
}
