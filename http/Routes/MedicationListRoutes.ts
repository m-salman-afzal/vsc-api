import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {MedicationListController} from "@controllers/MedicationListController";

export const MedicationListRouter = Router();

MedicationListRouter.get("/", AuthMiddleware, MedicationListController.getMedicationList);
MedicationListRouter.get("/download", AuthMiddleware, MedicationListController.downloadMedicationList);
MedicationListRouter.get("/lastUpdate", AuthMiddleware, MedicationListController.getMedicationListLastUpdate);
