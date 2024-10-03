import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";
import {InventoryMiddleware} from "@middlewares/InventoryMiddleware";

import {InventoryHistorytController} from "@controllers/InventoryHistoryController";

export const InventoryHistoryRouter = Router();

InventoryHistoryRouter.get("/", AuthMiddleware, InventoryHistorytController.getInventoryHistoryList);
InventoryHistoryRouter.get(
    "/download/:inventoryHistoryId",
    AuthMiddleware,
    InventoryMiddleware,
    InventoryHistorytController.downloadInventoryHistory
);
