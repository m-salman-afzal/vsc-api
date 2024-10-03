import type {FormularyEntity} from "@entities/Formulary/FormularyEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {Admin} from "@infrastructure/Database/Models/Admin";
import type {CartRequestDrug} from "@infrastructure/Database/Models/CartRequestDrug";
import type {CartRequestLog} from "@infrastructure/Database/Models/CartRequestLog";
import type {Formulary} from "@infrastructure/Database/Models/Formulary";
import type {Inventory} from "@infrastructure/Database/Models/Inventory";
import type PaginationOptions from "@infraUtils/PaginationOptions";
import type {TFilterFormulary} from "@repositories/Shared/Query/FormularyQueryBuilder";

export type TFormularyWithCartRequestDrug = Formulary &
    Admin &
    CartRequestLog &
    Inventory &
    CartRequestDrug & {
        isActiveInventory: boolean;
        totalInventoryQuantity: number;
        totalUnits: number;
    };
export interface IFormularyRepository extends IBaseRepository<Formulary, FormularyEntity> {
    fetchAllWithInventory(searchFilters: TFilterFormulary): Promise<false | Formulary[]>;

    fetchPaginatedWithLevelAndInventory(
        searchFilters: TFilterFormulary,
        pagination: PaginationOptions
    ): Promise<false | {count: number; rows: Formulary[]}>;

    fetchAllWithLevelAndInventory(searchFilters: TFilterFormulary): Promise<
        | (Formulary & {
              facilityId: string;
              ndc: string;
              idControlledDrug: number;
              idInventory: number;
              idFormulary: number;
              controlledQuantity: number;
              quantityInventory: number;
              isActiveInventory: number;
          })[]
        | false
    >;

    fetchPaginatedForCartPick(
        searchFilters: TFilterFormulary,
        pagination: PaginationOptions
    ): Promise<
        | {
              count: number;
              rows: Formulary[];
          }
        | false
    >;

    fetchAllForCentralSupply(searchFilters: TFilterFormulary): Promise<Formulary[] | false>;

    fetchAllWithLevelAndInventoryForCentralSupply(searchFilters: TFilterFormulary): Promise<Formulary[] | false>;
}
