// prettier-ignore
import * as Resolver from "@infrastructure/DIContainer/Resolver";
// prettier-ignore
import * as Container from "@infrastructure/DIContainer/Container";

import {CentralSupplyLogService} from "@application/CentralSupplyLog/CentralSupplyLogService";
import {CentralSupplyLogDrugService} from "@application/CentralSupplyLogDrug/CentralSupplyLogDrugService";
import {FormularyService} from "@application/Formulary/FormularyService";
import {FormularyLevelService} from "@application/FormularyLevel/FormularyLevelService";
import {InventoryService} from "@application/Inventory/InventoryService";

import {CentralSupplyLogDrugRepository} from "@repositories/CentralSupplyLogDrugRepository";
import {CentralSupplyLogRepository} from "@repositories/CentralSupplyLogRepository";
import {FormularyLevelRepository} from "@repositories/FormularyLevelRepository";
import {FormularyRepository} from "@repositories/FormularyRepository";
import {InventoryRepository} from "@repositories/InventoryRepository";

Container;
Resolver;

export const formularyRepository = new FormularyRepository();
export const formularyLevelRepository = new FormularyLevelRepository();
export const inventoryRepository = new InventoryRepository();
export const centralSupplyLogRepository = new CentralSupplyLogRepository();
export const centralSupplyLogDrugRepository = new CentralSupplyLogDrugRepository();

export const formularyService = new FormularyService(formularyRepository);
export const formularyLevelService = new FormularyLevelService(formularyLevelRepository);
export const inventoryService = new InventoryService(inventoryRepository);
export const centralSupplyLogDrugService = new CentralSupplyLogDrugService(centralSupplyLogDrugRepository);
export const centralSupplyLogService = new CentralSupplyLogService(
    centralSupplyLogRepository,
    centralSupplyLogDrugService,
    formularyService,
    formularyLevelService,
    inventoryService
);
