import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";
import {InventoryMiddleware} from "@middlewares/InventoryMiddleware";

import {CentralSupplyLogController} from "@controllers/CentralSupplyLogController";
import {CentralSupplyLogDrugController} from "@controllers/CentralSupplyLogDrugController";
import {ControlledDrugController} from "@controllers/ControlledDrugController";
import {FileController} from "@controllers/FileController";
import {InventoryController} from "@controllers/InventoryController";

export const InventoryRouter = Router();

InventoryRouter.post("/", AuthMiddleware, InventoryController.addInventory);
InventoryRouter.get("/", AuthMiddleware, InventoryMiddleware, InventoryController.getInventory);
InventoryRouter.put("/:inventoryId", AuthMiddleware, InventoryController.updateInventory);
InventoryRouter.delete("/:inventoryId", AuthMiddleware, InventoryController.removeInventory);
InventoryRouter.get("/suggestion", AuthMiddleware, InventoryController.getInventorySuggestion);
InventoryRouter.get("/fetchAll", AuthMiddleware, InventoryMiddleware, InventoryController.getAllInventory);

InventoryRouter.post("/formularyLevels/bulkUpsert", AuthMiddleware, FileController.addFile);
InventoryRouter.post("/bulkUpsert", AuthMiddleware, FileController.addFile);

InventoryRouter.put("/controlledDrug/:controlledDrugId", AuthMiddleware, ControlledDrugController.updateControlledDrug);
InventoryRouter.delete(
    "/controlledDrug/:controlledDrugId",
    AuthMiddleware,
    ControlledDrugController.removeControlledDrug
);

InventoryRouter.get(
    "/centralSupply/rxOrders",
    AuthMiddleware,
    InventoryMiddleware,
    CentralSupplyLogController.getCentralSupplyDrugs
);
InventoryRouter.post("/centralSupply/rxOrders", AuthMiddleware, CentralSupplyLogController.addCentralSupplyLog);
InventoryRouter.get("/centralSupply/logs", AuthMiddleware, CentralSupplyLogController.getCentralSupplyLogs);
InventoryRouter.get(
    "/centralSupply/logDrugs/:centralSupplyLogId",
    AuthMiddleware,
    InventoryMiddleware,
    CentralSupplyLogDrugController.getCentralSupplyLogDrugs
);
InventoryRouter.get(
    "/centralSupply/orderedQuantity",
    AuthMiddleware,
    CentralSupplyLogController.getMinMaxOrderedQuantity
);

InventoryRouter.get(
    "/centralSupply/download",
    AuthMiddleware,
    InventoryMiddleware,
    CentralSupplyLogController.downloadCentralSupplyLog
);
