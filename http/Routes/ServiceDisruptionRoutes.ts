import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {FileController} from "@controllers/FileController";
import {ServiceDisruptionController} from "@controllers/ServiceDisruptionController";
import {ServiceDisruptionPatientController} from "@controllers/ServiceDisruptionPatientController";

export const ServiceDisruptionRouter = Router();

ServiceDisruptionRouter.get("/", AuthMiddleware, ServiceDisruptionController.getServiceDisruption);
ServiceDisruptionRouter.get(
    "/serviceDisruptionPatients",
    AuthMiddleware,
    ServiceDisruptionPatientController.getServiceDisruptionPatient
);
ServiceDisruptionRouter.delete(
    "/:serviceDisruptionId",
    AuthMiddleware,
    ServiceDisruptionController.removeServiceDisruption
);

ServiceDisruptionRouter.post("/bulkUpsert", AuthMiddleware, FileController.addFile);
