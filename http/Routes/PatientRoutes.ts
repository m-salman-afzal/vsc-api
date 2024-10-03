import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {PatientController} from "@controllers/PatientController";

export const PatientRouter = Router();

PatientRouter.get("/", AuthMiddleware, PatientController.getPatients);
