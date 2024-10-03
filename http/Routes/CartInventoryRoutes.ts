import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {CartInventoryController} from "@controllers/CartInventoryController";
import {PerpetualInventoryController} from "@controllers/PerpetualInventoryController";

export const CartInventoryRouter = Router();

CartInventoryRouter.get("/", AuthMiddleware, CartInventoryController.getCartInventory);
CartInventoryRouter.get("/getCarts", AuthMiddleware, PerpetualInventoryController.getCarts);
