import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {BridgeTherapyController} from "@controllers/BridgeTherapyController";
import {PatientController} from "@controllers/PatientController";

export const BridgeTherapyRouter = Router();

BridgeTherapyRouter.post("/", AuthMiddleware, BridgeTherapyController.addBridgeTherapy);
BridgeTherapyRouter.get("/patients", AuthMiddleware, PatientController.getPatients);
BridgeTherapyRouter.get("/", AuthMiddleware, BridgeTherapyController.getBridgeTherapyLogs);
BridgeTherapyRouter.get("/download", AuthMiddleware, BridgeTherapyController.downloadBridgeTherapyLog);
BridgeTherapyRouter.get("/bridgeTherapyAdmins", AuthMiddleware, BridgeTherapyController.getBridgeTherapyAdmins);
