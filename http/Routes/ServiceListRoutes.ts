import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {ServiceListController} from "@controllers/ServiceListController";

export const ServiceListRouter = Router();

ServiceListRouter.get("/", AuthMiddleware, ServiceListController.getServiceLists);
ServiceListRouter.post("/", AuthMiddleware, ServiceListController.addServiceList);
ServiceListRouter.put("/:serviceListId", AuthMiddleware, ServiceListController.updateServiceList);
ServiceListRouter.delete("/:serviceListId", AuthMiddleware, ServiceListController.removeServiceList);
