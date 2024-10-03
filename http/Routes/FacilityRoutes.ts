import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {FacilityController} from "@controllers/FacilityController";

export const FacilityRouter = Router();

FacilityRouter.post("/add", AuthMiddleware, FacilityController.addFacility);
FacilityRouter.get("/", AuthMiddleware, FacilityController.getFacilities);
FacilityRouter.put("/edit/:facilityId", AuthMiddleware, FacilityController.updateFacility);
FacilityRouter.delete("/remove/:facilityId", AuthMiddleware, FacilityController.removeFacility);
