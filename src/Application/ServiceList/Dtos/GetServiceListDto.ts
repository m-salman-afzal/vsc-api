import type {IServiceListEntity} from "@entities/ServiceList/ServiceListEntity";

type TGetServiceListDto = Partial<IServiceListEntity>;

export interface GetServiceListDto extends TGetServiceListDto {}

export class GetServiceListDto {
    private constructor(body: TGetServiceListDto) {
        this.serviceListId = body.serviceListId as string;
        this.name = body.name as string;
    }

    static create(body: unknown) {
        return new GetServiceListDto(body as TGetServiceListDto);
    }
}
