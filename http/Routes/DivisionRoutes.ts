import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import DivisionController from "@controllers/DivisionController";

export const DivisionRouter = Router();

DivisionRouter.get("/", AuthMiddleware, DivisionController.getDivisions);
DivisionRouter.get("/reports", AuthMiddleware, DivisionController.getReports);
