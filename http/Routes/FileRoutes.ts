import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {FileController} from "@controllers/FileController";

export const FileRouter = Router();

FileRouter.get("/", AuthMiddleware, FileController.getFiles);
FileRouter.get("/download/:fileId", AuthMiddleware, FileController.downloadFile);

FileRouter.post("/divisionStatsFile", AuthMiddleware, FileController.addDivisionStatsFile);
FileRouter.post("/administrativeFile", AuthMiddleware, FileController.addAdministrativeFile);
