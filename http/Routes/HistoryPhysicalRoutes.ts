import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {HistoryPhysicalController} from "@controllers/HistoryPhysicalController";

export const HistoryPhysicalRouter = Router();

HistoryPhysicalRouter.get("/", AuthMiddleware, HistoryPhysicalController.getHistoryPhysicalData);
