import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {CartController} from "@controllers/CartController";
import {CartRequestDrugController} from "@controllers/CartRequestDrugController";
import {CartRequestLogController} from "@controllers/CartRequestLogController";
import {FileController} from "@controllers/FileController";
import {InventoryController} from "@controllers/InventoryController";

export const CartRequestDrugRouter = Router();

CartRequestDrugRouter.get("/controlledIds", AuthMiddleware, InventoryController.getControlledIds);
CartRequestDrugRouter.get("/getAdmins", AuthMiddleware, CartRequestDrugController.getAdmins);

CartRequestDrugRouter.get("/cartRequestLogs", AuthMiddleware, CartRequestLogController.getCartRequestLogs);
CartRequestDrugRouter.get("/allCarts", AuthMiddleware, CartController.getAllCarts);
CartRequestDrugRouter.get("/", AuthMiddleware, CartRequestDrugController.getCartRequestDrugs);

CartRequestDrugRouter.get("/picks", AuthMiddleware, CartRequestDrugController.getCartPicks);
CartRequestDrugRouter.put("/picks", AuthMiddleware, CartRequestDrugController.updateCartPicks);

CartRequestDrugRouter.get("/allocations", AuthMiddleware, CartRequestDrugController.getCartAllocations);
CartRequestDrugRouter.put("/allocations", AuthMiddleware, CartRequestDrugController.updateCartAllocations);

CartRequestDrugRouter.delete("/", AuthMiddleware, CartRequestDrugController.removeCartRequestDrug);

CartRequestDrugRouter.post("/bulkUpsert", AuthMiddleware, FileController.addFile);
