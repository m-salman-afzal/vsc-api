import type {IServiceListEntity} from "@entities/ServiceList/ServiceListEntity";

type TRemoveServiceListDto = Pick<IServiceListEntity, "serviceListId">;

export interface RemoveServiceListDto extends TRemoveServiceListDto {}

export class RemoveServiceListDto {
    private constructor(body: TRemoveServiceListDto) {
        this.serviceListId = body.serviceListId;
    }

    static create(body: unknown) {
        return new RemoveServiceListDto(body as TRemoveServiceListDto);
    }
}
