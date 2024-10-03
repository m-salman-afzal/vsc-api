import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {RoleController} from "@controllers/RoleController";

export const RoleRouter = Router();

RoleRouter.get("/", AuthMiddleware, RoleController.getRoles);
RoleRouter.post("/", AuthMiddleware, RoleController.addRole);
RoleRouter.put("/", AuthMiddleware, RoleController.updateRole);
RoleRouter.delete("/:roleId", AuthMiddleware, RoleController.removeRole);
