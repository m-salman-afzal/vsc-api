import type {IPerpetualInventoryEntity} from "@entities/PerpetualInventory/PerpetualInventoryEntity";
import type {PerpetualInventory} from "@infrastructure/Database/Models/PerpetualInventory";
import type {TQueryBuilder} from "@src/typings/ORM";

export type TFilterPerpetualInventory = Partial<
    Pick<IPerpetualInventoryEntity, "cartId" | "name" | "facilityId" | "controlledDrugId"> & {isArchived: boolean}
>;
type TQueryBuilderPerpetualInventory = TQueryBuilder<PerpetualInventory>;

export class PerpetualInventoryQueryBuilder {
    private query: TQueryBuilderPerpetualInventory;
    constructor(query: TQueryBuilderPerpetualInventory, filters: TFilterPerpetualInventory) {
        this.query = query;

        this.setName(filters);
        this.setCartId(filters);
        this.setFacilityId(filters);
        this.setControlledDrugId(filters);
        this.setIsArchive(filters);
    }

    static setFilter(query: TQueryBuilderPerpetualInventory, filters: TFilterPerpetualInventory) {
        return new PerpetualInventoryQueryBuilder(query, filters).query;
    }

    setCartId(filters: TFilterPerpetualInventory) {
        if (filters.cartId) {
            this.query.andWhere("perpetualInventory.cartId = :cartId", {cartId: filters.cartId});
        }
    }

    setName(filters: TFilterPerpetualInventory) {
        if (filters.name) {
            this.query.andWhere("perpetualInventory.name LIKE :name", {
                name: `%${filters.name}%`
            });
        }
    }
    setFacilityId(filters: TFilterPerpetualInventory) {
        if (filters.facilityId) {
            this.query.andWhere("perpetualInventory.facilityId = :facilityId", {facilityId: filters.facilityId});
        }
    }
    setControlledDrugId(filters: TFilterPerpetualInventory) {
        if (filters.controlledDrugId) {
            this.query.andWhere("perpetualInventory.controlledDrugId = :controlledDrugId", {
                controlledDrugId: filters.controlledDrugId
            });
        }
    }

    setIsArchive(filters: TFilterPerpetualInventory) {
        if (filters.isArchived) {
            this.query.andWhere("perpetualInventory.isArchived = :isArchived", {isArchived: true});
        } else {
            this.query.andWhere(
                "(perpetualInventory.isArchived = :isArchived OR perpetualInventory.isArchived IS NULL)",
                {isArchived: false}
            );
        }
    }
}
