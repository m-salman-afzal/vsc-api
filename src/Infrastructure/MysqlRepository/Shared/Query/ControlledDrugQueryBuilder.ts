import type {IControlledDrugEntity} from "@entities/ControlledDrug/ControlledDrugEntity";
import type {ControlledDrug} from "@infrastructure/Database/Models/ControlledDrug";
import type {TQueryBuilder} from "@typings/ORM";

export type TFilterControlledDrug = Partial<IControlledDrugEntity>;

type TQueryBuilderControlledDrug = TQueryBuilder<ControlledDrug>;

export class ControlledDrugQueryBuilder {
    private query: TQueryBuilderControlledDrug;
    constructor(query: TQueryBuilderControlledDrug, filters: TFilterControlledDrug) {
        this.query = query;

        this.setControlledId(filters);
    }

    static setFilter(query: TQueryBuilderControlledDrug, filters: TFilterControlledDrug) {
        return new ControlledDrugQueryBuilder(query, filters).query;
    }

    setControlledId(filters: TFilterControlledDrug) {
        if (filters.inventoryId) {
            this.query.andWhere("inventory.inventoryId = :inventoryId", {
                inventoryId: filters.inventoryId
            });
        }
    }
}
