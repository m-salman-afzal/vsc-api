import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {RoleServiceListController} from "@controllers/RoleServiceListController";

export const RoleServiceListRouter = Router();

RoleServiceListRouter.get("/", AuthMiddleware, RoleServiceListController.getRoleServiceLists);
RoleServiceListRouter.post("/", AuthMiddleware, RoleServiceListController.addRoleServiceList);
RoleServiceListRouter.put("/", AuthMiddleware, RoleServiceListController.updateRoleServiceList);
RoleServiceListRouter.delete("/:roleServiceListId", AuthMiddleware, RoleServiceListController.removeRoleServiceList);
