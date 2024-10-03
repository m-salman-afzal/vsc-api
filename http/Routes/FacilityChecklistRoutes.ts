import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {FacilityChecklistController} from "@controllers/FacilityChecklistController";

export const FacilityChecklistRouter = Router();

FacilityChecklistRouter.post("/", AuthMiddleware, FacilityChecklistController.addFacilityChecklist);
FacilityChecklistRouter.get("/", AuthMiddleware, FacilityChecklistController.getFacilityChecklist);
FacilityChecklistRouter.get("/suggestion", AuthMiddleware, FacilityChecklistController.getFacilityAdminSuggestion);
