import type {IAdminEntity} from "@entities/Admin/AdminEntity";

type TRemoveAdminDto = Partial<Pick<IAdminEntity, "adminId" | "id">>;

export interface RemoveAdminDto extends TRemoveAdminDto {}

export class RemoveAdminDto {
    constructor(body: TRemoveAdminDto) {
        this.adminId = body.adminId as string;
        this.id = body.id as number;
    }

    static create(body: TRemoveAdminDto) {
        return new RemoveAdminDto(body);
    }
}
