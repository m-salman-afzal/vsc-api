import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {FacilityUnitsController} from "@controllers/FacilityUnitsController";

export const FacilityUnitsRouter = Router();

FacilityUnitsRouter.get("/", AuthMiddleware, FacilityUnitsController.getUnits);
FacilityUnitsRouter.put("/", AuthMiddleware, FacilityUnitsController.updateUnits);
FacilityUnitsRouter.get("/unassigned", AuthMiddleware, FacilityUnitsController.getUnassignedUnits);
