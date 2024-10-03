import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {FormularyController} from "@controllers/FormularyController";
import {RefillStockController} from "@controllers/RefillStockController";

export const RefillStockRouter = Router();

RefillStockRouter.put("/", AuthMiddleware, RefillStockController.refillStockFormulary);
RefillStockRouter.get("/", AuthMiddleware, FormularyController.getFormulary);
