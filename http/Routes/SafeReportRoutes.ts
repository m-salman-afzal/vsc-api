import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";
import {SafeReportMiddleware} from "@middlewares/SafeReportMiddleware";

import {FacilityChecklistController} from "@controllers/FacilityChecklistController";
import {ReportController} from "@controllers/ReportController";

export const SafeReportRouter = Router();

SafeReportRouter.get("/", AuthMiddleware, SafeReportMiddleware, ReportController.getReports);

SafeReportRouter.get("/facilityChecklist", AuthMiddleware, FacilityChecklistController.getFacilityChecklist);

SafeReportRouter.get("/:reportId", AuthMiddleware, SafeReportMiddleware, ReportController.getReport);

SafeReportRouter.put("/:reportId", AuthMiddleware, ReportController.updateReport);
