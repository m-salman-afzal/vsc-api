import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {AdminController} from "@controllers/AdminController";
import {FacilityChecklistController} from "@controllers/FacilityChecklistController";
import {FileController} from "@controllers/FileController";

export const AdminRouter = Router();

AdminRouter.post("/add", AuthMiddleware, AdminController.addAdmin);
AdminRouter.get("/", AuthMiddleware, AdminController.getAdmins);
AdminRouter.put("/edit/:adminId", AuthMiddleware, AdminController.updateAdmin);
AdminRouter.delete("/remove/:adminId", AuthMiddleware, AdminController.removeAdmin);
AdminRouter.post("/bulkUpsert", AuthMiddleware, FileController.addFile);

AdminRouter.get("/adminFacilityCheckList", AuthMiddleware, FacilityChecklistController.getFacilityChecklist);
