import type IBaseRepository from "@entities/IBaseRepository";
import type {RoleEntity} from "@entities/Role/RoleEntity";
import type {Role} from "@infrastructure/Database/Models/Role";
import type {TFilterRole} from "@repositories/Shared/Query/RoleQueryBuilder";

export interface IRoleRepository extends IBaseRepository<Role, RoleEntity> {
    fetchAllByQuery(): Promise<false | Role[]>;
    fetchWithAdmin(searchFilters: TFilterRole): Promise<false | Role>;
}
