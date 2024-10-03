import type {CentralSupplyLogDrugEntity} from "@entities/CentralSupplyLogDrug/CentralSupplyLogDrugEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {CentralSupplyLogDrug} from "@infrastructure/Database/Models/CentralSupplyLogDrug";
import type {TFilterCentralSupplyLogDrug} from "@repositories/Shared/Query/CentralSupplyLogDrugQueryBuilder";

export interface ICentralSupplyLogDrugRepository
    extends IBaseRepository<CentralSupplyLogDrug, CentralSupplyLogDrugEntity> {
    fetchAllBySearchQuery(searchFilters: TFilterCentralSupplyLogDrug): Promise<CentralSupplyLogDrug[] | false>;
}
