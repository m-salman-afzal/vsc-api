import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";
import {ReportMiddleware} from "@middlewares/ReportMiddleware";

import {FacilityChecklistController} from "@controllers/FacilityChecklistController";
import {ReportController} from "@controllers/ReportController";

export const ReportRouter = Router();

ReportRouter.post("/", AuthMiddleware, ReportController.addReport);

ReportRouter.get("/", AuthMiddleware, ReportMiddleware, ReportController.getReports);

ReportRouter.get("/facilityChecklist", AuthMiddleware, FacilityChecklistController.getFacilityChecklist);

ReportRouter.get("/:reportId", AuthMiddleware, ReportMiddleware, ReportController.getReport);

ReportRouter.put("/:reportId", AuthMiddleware, ReportController.updateReport);

ReportRouter.delete("/:reportId", AuthMiddleware, ReportController.removeReport);
