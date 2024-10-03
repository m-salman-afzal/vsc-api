import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {CartController} from "@controllers/CartController";
import {CartRequestFormController} from "@controllers/CartRequestFormController";
import {InventoryController} from "@controllers/InventoryController";

export const CartRequestFormRouter = Router();

CartRequestFormRouter.post("/", AuthMiddleware, CartRequestFormController.upsertCartRequestForm);

CartRequestFormRouter.get("/", AuthMiddleware, CartRequestFormController.getCartRequestForms);

CartRequestFormRouter.get("/allCarts", AuthMiddleware, CartController.getAllCarts);

CartRequestFormRouter.get("/controlledIds", AuthMiddleware, InventoryController.getControlledIds);
