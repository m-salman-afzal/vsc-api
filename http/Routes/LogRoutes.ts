import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import LogController from "@controllers/LogController";

export const LogRouter = Router();

LogRouter.get("/", AuthMiddleware, LogController.getLogs);
