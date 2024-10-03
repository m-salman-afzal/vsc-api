import type {IServiceListEntity} from "@entities/ServiceList/ServiceListEntity";

type TAddServiceListDto = Omit<IServiceListEntity, "roleId">;

export interface AddServiceListDto extends TAddServiceListDto {}

export class AddServiceListDto {
    private constructor(body: TAddServiceListDto) {
        this.name = body.name;
    }

    static create(body: unknown) {
        return new AddServiceListDto(body as TAddServiceListDto);
    }
}
