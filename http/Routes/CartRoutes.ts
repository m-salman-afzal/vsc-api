import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {CartController} from "@controllers/CartController";

export const CartRouter = Router();

CartRouter.post("/", AuthMiddleware, CartController.addCart);

CartRouter.get("/", AuthMiddleware, CartController.getPaginatedCarts);

CartRouter.get("/all", AuthMiddleware, CartController.getCarts);

CartRouter.get("/names", AuthMiddleware, CartController.getCartNames);

CartRouter.put("/:facilityId", AuthMiddleware, CartController.updateCart);

CartRouter.delete("/:facilityId", AuthMiddleware, CartController.removeCart);
