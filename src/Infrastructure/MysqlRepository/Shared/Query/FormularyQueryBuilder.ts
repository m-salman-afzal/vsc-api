import {CART_REQUEST_TYPE} from "@constants/CartRequestConstant";
import {CONTROLLED_TYPE} from "@constants/InventoryConstant";

import SharedUtils from "@appUtils/SharedUtils";

import {Inventory} from "@infrastructure/Database/Models/Inventory";

import type {ICartRequestDrugEntity} from "@entities/CartRequestDrug/CartRequestDrugEntity";
import type {ICartRequestLogEntity} from "@entities/CartRequestLog/CartRequestLogEntity";
import type {IFormularyEntity} from "@entities/Formulary/FormularyEntity";
import type {IFormularyLevelEntity} from "@entities/FormularyLevel/FormularyLevelEntity";
import type {IInventoryEntity} from "@entities/Inventory/InventoryEntity";
import type {Formulary} from "@infrastructure/Database/Models/Formulary";
import type {TQueryBuilder} from "@src/typings/ORM";

export type TFilterFormulary = Omit<
    Partial<IFormularyEntity> &
        Partial<IInventoryEntity> &
        Partial<ICartRequestDrugEntity> &
        Partial<ICartRequestLogEntity> &
        Partial<IFormularyLevelEntity> &
        Partial<{
            toDate: string | undefined;
            fromDate: string | undefined;
            futureExpiry: string | undefined;
            refillStock: boolean;
            isPendingOrder: boolean;
            isDepleted: boolean;
            isActiveInventory: boolean;
            formularyLevelFacilityId?: string;
            facilityIdWithoutPending?: boolean;
            isActiveInventoryForPick: boolean;
            pastExpiry: boolean;
            cartFacilityId: string;
            inventoryFacilityId: string;
            undo: boolean;
            isCentralSupply: boolean;
            orderedQuantityMin: number;
            orderedQuantityMax: number;
            isActiveInventoryForNdcStatus: string;
            fromInventory: boolean;
        }>,
    "formularyId"
> & {
    formularyId?: string | string[];
};

type TQueryBuilderFormulary = TQueryBuilder<Formulary>;

export class FormularyQueryBuilder {
    private query: TQueryBuilderFormulary;
    constructor(query: TQueryBuilderFormulary, filters: TFilterFormulary) {
        this.query = query;

        this.setFormularyId(filters);
        this.setId(filters);
        this.setInventoryId(filters);
        this.setNdc(filters);
        this.setManufacturer(filters);
        this.setExpirationDate(filters);
        this.setIsActive(filters);
        this.setIsControlled(filters);
        this.setIsFormulary(filters);
        this.setQuantity(filters);
        this.setFacilityId(filters);
        this.formularyLevelFacilityId(filters);
        this.setCartPickStatus(filters);
        this.setCartFacilityId(filters);
        this.setCartAllocationStatus(filters);
        this.setName(filters);
        this.setPickUndo(filters);
        this.setControlledType(filters);
        this.setIsActiveInventoryForPick(filters);
        this.setIsStock(filters);
        this.setOrderdQuantity(filters);
        this.setCenterSupply(filters);
        this.setIsActiveInventory(filters);
    }

    static setFilter(query: TQueryBuilderFormulary, filters) {
        return new FormularyQueryBuilder(query, filters).query;
    }

    setId(filters: TFilterFormulary) {
        if (!Number.isNaN(Number(filters.id))) {
            this.query.andWhere("formulary.id = :id", {id: filters.id});
        }
    }

    setFormularyId(filters: TFilterFormulary) {
        if (Array.isArray(filters.formularyId)) {
            this.query.andWhere("formulary.formularyId IN (:...formularyId)", {formularyId: filters.formularyId});

            return;
        }

        if (filters.formularyId) {
            this.query.andWhere("formulary.formularyId = :formularyId", {formularyId: filters.formularyId});
        }
    }

    setInventoryId(filters: TFilterFormulary) {
        if (filters.inventoryId) {
            this.query.andWhere("inventory.inventoryId = :inventoryId", {inventoryId: filters.inventoryId});
        }
    }

    setNdc(filters: TFilterFormulary) {
        if (filters.ndc) {
            this.query.andWhere("inventory.ndc = :ndc", {ndc: filters.ndc});
        }
    }

    setManufacturer(filters: TFilterFormulary) {
        if (filters.manufacturer) {
            this.query.andWhere("inventory.manufacturer = :manufacturer", {manufacturer: `%${filters.manufacturer}%`});
        }
    }

    setExpirationDate(filters: TFilterFormulary) {
        if (filters.toDate && filters.fromDate && !filters.futureExpiry) {
            this.query.andWhere("inventory.expirationDate BETWEEN :fromDate AND :toDate", {
                fromDate: filters.fromDate,
                toDate: filters.toDate
            });

            return;
        }

        if (filters.futureExpiry && !(filters.toDate && filters.fromDate)) {
            this.query.andWhere("inventory.expirationDate >= :futureExpiry", {
                futureExpiry: SharedUtils.getCurrentDate({})
            });
        }

        if (filters.pastExpiry && !(filters.toDate && filters.fromDate)) {
            this.query.andWhere("inventory.expirationDate <= :pastExpiry", {
                pastExpiry: SharedUtils.getCurrentDate({})
            });
        }
    }

    setQuantity(filters: TFilterFormulary) {
        if (filters.quantity) {
            this.query.andWhere("inventory.quantity = :quantity", {quantity: filters.quantity});
        }
    }

    setIsActive(filters: TFilterFormulary) {
        if (SharedUtils.isFalsyBooleanPresent(filters, "isActive")) {
            this.query.andWhere("formulary.isActive = :isActive", {
                isActive: filters.isActive
            });
        }
    }

    setIsActiveInventoryForPick(filters: TFilterFormulary) {
        if (SharedUtils.isFalsyBooleanPresent(filters, "isActiveInventoryForPick")) {
            this.query.andWhere("inventory.isActive = :isActiveInventoryForPick", {
                isActiveInventoryForPick: filters.isActiveInventoryForPick
            });
        }
    }

    setIsControlled(filters: TFilterFormulary) {
        if (SharedUtils.isFalsyBooleanPresent(filters, "isControlled")) {
            this.query.andWhere("formulary.isControlled = :isControlled", {
                isControlled: filters.isControlled
            });
        }
    }

    setIsFormulary(filters: TFilterFormulary) {
        if (SharedUtils.isFalsyBooleanPresent(filters, "isFormulary")) {
            this.query.andWhere("formulary.isFormulary = :isFormulary", {
                isFormulary: filters.isFormulary
            });
        }
    }

    setFacilityId(filters: TFilterFormulary) {
        if (
            filters.facilityId &&
            (SharedUtils.isFalsyBooleanPresent(filters, "isPendingOrder") || filters.facilityIdWithoutPending)
        ) {
            this.query.andWhere("inventory.facilityId = :facilityId", {facilityId: filters.facilityId});
        }
    }

    formularyLevelFacilityId(filters: TFilterFormulary) {
        if (filters.formularyLevelFacilityId) {
            this.query.andWhere("formularyLevel.facilityId = :facilityId", {
                facilityId: filters.formularyLevelFacilityId
            });
        }
    }

    setCartPickStatus(filters: TFilterFormulary) {
        if (filters.pickStatus) {
            this.query.andWhere("cartRequestDrug.pickStatus = :pickStatus", {pickStatus: filters.pickStatus});
        }
    }

    setCartFacilityId(filters: TFilterFormulary) {
        if (filters.cartFacilityId) {
            this.query.andWhere("cartRequestDrug.facilityId = :facilityId", {facilityId: filters.cartFacilityId});
        }
    }

    setCartAllocationStatus(filters: TFilterFormulary) {
        if (filters.allocationStatus) {
            this.query.andWhere("cartRequestDrug.allocationStatus = :allocationStatus", {
                allocationStatus: filters.allocationStatus
            });
        }
    }

    setName(filters: TFilterFormulary) {
        if (Number.isNaN(Number(filters.id)) && filters.name) {
            this.query.andWhere("formulary.name LIKE :name", {
                name: `%${filters.name}%`
            });
        }
    }

    setPickUndo(filters: TFilterFormulary) {
        if (filters.type === CART_REQUEST_TYPE.PICK) {
            this.query.andWhere("cartRequestPickLog.canUndo = true");
        }
    }

    setControlledType(filters: TFilterFormulary) {
        if (filters.controlledType) {
            this.query.andWhere(
                "(controlledDrug.controlledType = :controlledType OR controlledDrug.controlledType IS NULL)",
                {
                    controlledType: filters.controlledType
                }
            );
        }
    }

    setOrderdQuantity(filters: TFilterFormulary) {
        if (filters.orderedQuantity) {
            this.query.andWhere("(formularyLevel.orderedQuantity > 0 OR formularyLevel.orderedQuantity IS NULL)");
        }
    }

    setIsStock(filters: TFilterFormulary) {
        const isDepleted = SharedUtils.isFalsyBooleanPresent(filters, "isDepleted");
        const isPendingOrder = SharedUtils.isFalsyBooleanPresent(filters, "isPendingOrder");
        const isCentralSupply = SharedUtils.isFalsyBooleanPresent(filters, "isCentralSupply");
        const isActiveInventory = SharedUtils.isFalsyBooleanPresent(filters, "isActiveInventory");

        if (isDepleted || isPendingOrder || isCentralSupply) {
            isCentralSupply &&
                this.query.andWhere("(formularyLevel.isStock = :isStock OR formularyLevel.isStock IS NULL)", {
                    isStock: true
                });

            const totalQuantity =
                isActiveInventory && !isCentralSupply
                    ? `IF(
                    formulary.isControlled = false, 
                    SUM(I.quantity), 
                    SUM(CD.controlledQuantity)
                    )`
                    : `IF(
                    formulary.isControlled = false, 
                    COALESCE(SUM(IF(I.isActive = false, 0, I.quantity)), 0), 
                    COALESCE(SUM(IF(I.isActive = false, 0, CD.controlledQuantity)), 0)
                    )`;

            const subQuery = this.query
                .subQuery()
                .select(`formularyId`)
                .from((subQuery) => {
                    const sq = subQuery
                        .select(`formularyId`)
                        .addSelect(totalQuantity, "totalQuantity")
                        .from(Inventory, "I")
                        .leftJoin("I.controlledDrug", "CD", "CD.controlledType = :controlledType", {
                            controlledType: CONTROLLED_TYPE.STOCK
                        })
                        .where("I.deletedAt IS NULL")
                        .andWhere("I.facilityId = :facilityId", {facilityId: filters.facilityId})
                        .groupBy("formularyId");

                    isActiveInventory &&
                        !isCentralSupply &&
                        subQuery.andWhere("I.isActive = :isActiveInventory", {
                            isActiveInventory: filters.isActiveInventory
                        });

                    isDepleted && subQuery.having(`totalQuantity ${filters.isDepleted ? "<=" : ">"} 0`);

                    isPendingOrder &&
                        subQuery
                            .addGroupBy("formularyLevel.formularyLevelId")
                            .addGroupBy("formularyLevel.orderedQuantity")
                            .andHaving(
                                filters.isPendingOrder
                                    ? "formularyLevel.orderedQuantity > 0"
                                    : "(formularyLevel.orderedQuantity <= 0 OR formularyLevel.orderedQuantity IS NULL)"
                            );

                    isCentralSupply &&
                        subQuery
                            .addGroupBy("formularyLevel.orderedQuantity")
                            .addGroupBy("formularyLevel.parLevel")
                            .andHaving(
                                `IF(
                                totalQuantity < (formularyLevel.threshold + COALESCE(formularyLevel.orderedQuantity,0)),
                                formularyLevel.parLevel - totalQuantity - COALESCE(formularyLevel.orderedQuantity, 0), 
                                0
                                ) 
                            > 0`
                            );

                    filters.orderedQuantityMin &&
                        filters.orderedQuantityMax &&
                        subQuery.andHaving(
                            `formularyLevel.parLevel - totalQuantity - COALESCE(formularyLevel.orderedQuantity, 0) BETWEEN :orderedQuantityMin AND :orderedQuantityMax`,
                            {
                                orderedQuantityMin: filters.orderedQuantityMin,
                                orderedQuantityMax: filters.orderedQuantityMax
                            }
                        );

                    return sq;
                }, "centralSupply");

            this.query.andWhere(`formulary.formularyId IN ${subQuery.getQuery()}`);
        }
    }

    setCenterSupply(filters: TFilterFormulary) {
        if (SharedUtils.isFalsyBooleanPresent(filters, "isStock")) {
            this.query.andWhere("formularyLevel.isStock = :isStock", {
                isStock: filters.isStock
            });
        }
    }

    setIsActiveInventory(filters: TFilterFormulary) {
        if (filters.isActiveInventoryForNdcStatus) {
            switch (filters.isActiveInventoryForNdcStatus) {
                case "true":
                case "false": {
                    this.query.andWhere("inventory.isActive = :isActiveInventoryForNdcStatus", {
                        isActiveInventoryForNdcStatus: filters.isActiveInventory
                    });

                    return;
                }

                case "none": {
                    this.query.andWhere("inventory.inventoryId IS NULL");
                }
            }
        }
    }
}
