import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import DivisionSwornController from "@controllers/DivisionSwornController";

export const DivisionSwornRouter = Router();

DivisionSwornRouter.get("/personnel", AuthMiddleware, DivisionSwornController.getSwornPersonnel);
