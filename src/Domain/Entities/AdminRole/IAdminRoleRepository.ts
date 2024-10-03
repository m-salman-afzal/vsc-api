import type {AdminRoleEntity} from "@entities/AdminRole/AdminRoleEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {AdminRole} from "@infrastructure/Database/Models/AdminRole";
import type {TSearchFilters} from "@typings/ORM";

export type TFetchWithRolesFilter = Omit<TSearchFilters<AdminRole>, "adminId"> & {
    adminId?: string[] | undefined;
    roleId?: string[] | undefined;
    facilityId?: string | undefined;
};

export interface IAdminRoleRepository extends IBaseRepository<AdminRole, AdminRoleEntity> {
    fetchWithRoles(searchFilters: TFetchWithRolesFilter): Promise<false | AdminRole[]>;

    fetchWithAdmins(searchFilters: TFetchWithRolesFilter): Promise<false | AdminRole[]>;
}
