import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";
import {FormularyMiddleware} from "@middlewares/FormularyMiddleware";

import {FileController} from "@controllers/FileController";
import {FormularyController} from "@controllers/FormularyController";
import {FormularyLevelController} from "@controllers/FormularyLevelController";

export const FormularyRouter = Router();

FormularyRouter.post("/", AuthMiddleware, FormularyMiddleware, FormularyController.addFormulary);
FormularyRouter.get("/", AuthMiddleware, FormularyMiddleware, FormularyController.getFormulary);
FormularyRouter.put("/:formularyId", AuthMiddleware, FormularyController.updateFormulary);
FormularyRouter.delete("/:formularyId", AuthMiddleware, FormularyController.removeFormulary);
FormularyRouter.get("/fetchAll", AuthMiddleware, FormularyMiddleware, FormularyController.getAllFormulary);

FormularyRouter.post("/level", AuthMiddleware, FormularyLevelController.upsertFormularyLevel);

FormularyRouter.post("/bulkUpsert", AuthMiddleware, FormularyMiddleware, FileController.addFile);
