import type {ICentralSupplyLogDrugEntity} from "@entities/CentralSupplyLogDrug/CentralSupplyLogDrugEntity";
import type {CentralSupplyLogDrug} from "@infrastructure/Database/Models/CentralSupplyLogDrug";
import type {TQueryBuilder} from "@typings/ORM";

export type TFilterCentralSupplyLogDrug = Partial<
    ICentralSupplyLogDrugEntity & {
        formularyLevelFacilityId: string;
        isControlled?: boolean;
    }
>;

type TQueryBuilderCentralSupplyLogDrug = TQueryBuilder<CentralSupplyLogDrug>;

export class CentralSupplyLogDrugQueryBuilder {
    private query: TQueryBuilderCentralSupplyLogDrug;
    constructor(query: TQueryBuilderCentralSupplyLogDrug, filters: TFilterCentralSupplyLogDrug) {
        this.query = query;

        this.setCentralSupplyLogId(filters);
        this.setFormularyFacilityId(filters);
        this.setControlled(filters);
    }

    static setFilter(query: TQueryBuilderCentralSupplyLogDrug, filters: TFilterCentralSupplyLogDrug) {
        return new CentralSupplyLogDrugQueryBuilder(query, filters).query;
    }

    setCentralSupplyLogId(filters: TFilterCentralSupplyLogDrug) {
        if (filters.centralSupplyLogId) {
            this.query.andWhere("centralSupplyLogDrug.centralSupplyLogId = :centralSupplyLogId", {
                centralSupplyLogId: filters.centralSupplyLogId
            });
        }
    }

    setFormularyFacilityId(filters: TFilterCentralSupplyLogDrug) {
        if (filters.formularyLevelFacilityId) {
            this.query.andWhere("formularyLevel.facilityId = :formularyLevelFacilityId", {
                formularyLevelFacilityId: filters.formularyLevelFacilityId
            });
        }
    }

    setControlled(filters: TFilterCentralSupplyLogDrug) {
        if ("isControlled" in filters && filters.isControlled !== undefined && filters.isControlled !== null) {
            this.query.andWhere("formulary.isControlled = :isControlled", {
                isControlled: filters.isControlled
            });
        }
    }
}
