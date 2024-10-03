import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {ServiceDependencyController} from "@controllers/ServiceDependencyController";

export const ServiceDependencyRoutes = Router();

ServiceDependencyRoutes.post("/", AuthMiddleware, ServiceDependencyController.addServiceDependency);
