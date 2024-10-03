import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {CartController} from "@controllers/CartController";
import {CartRequestDrugController} from "@controllers/CartRequestDrugController";
import {CartRequestLogController} from "@controllers/CartRequestLogController";
import {ReferenceGuideController} from "@controllers/ReferenceGuideController";
import {ReferenceGuideDrugController} from "@controllers/ReferenceGuideDrugController";

export const ReferenceGuideRouter = Router();

ReferenceGuideRouter.get("/", AuthMiddleware, ReferenceGuideController.getReferenceGuides);
ReferenceGuideRouter.post("/", AuthMiddleware, ReferenceGuideController.addReferenceGuide);
ReferenceGuideRouter.put("/", AuthMiddleware, ReferenceGuideController.modifyReferenceGuide);

ReferenceGuideRouter.put("/:referenceGuideId", AuthMiddleware, ReferenceGuideController.updateReferenceGuide);
ReferenceGuideRouter.delete("/:referenceGuideId", AuthMiddleware, ReferenceGuideController.removeReferenceGuide);
ReferenceGuideRouter.put("/note/:referenceGuideId", AuthMiddleware, ReferenceGuideController.setReferenceGuideNote);
ReferenceGuideRouter.delete(
    "/note/:referenceGuideId",
    AuthMiddleware,
    ReferenceGuideController.removeReferenceGuideNote
);

ReferenceGuideRouter.get("/drugs", AuthMiddleware, ReferenceGuideDrugController.getReferenceGuideDrugs);
ReferenceGuideRouter.put(
    "/drugs/:referenceGuideDrugId",
    AuthMiddleware,
    ReferenceGuideDrugController.updateReferenceGuideDrug
);
ReferenceGuideRouter.delete(
    "/drugs/:referenceGuideDrugId",
    AuthMiddleware,
    ReferenceGuideDrugController.removeReferenceGuideDrug
);
ReferenceGuideRouter.get("/drugs/export", AuthMiddleware, ReferenceGuideDrugController.exportReferenceGuideDrugs);
ReferenceGuideRouter.get(
    "/drugs/categories",
    AuthMiddleware,
    ReferenceGuideDrugController.getReferenceGuideDrugCategories
);

ReferenceGuideRouter.get("/cartRequestLogs", AuthMiddleware, CartRequestLogController.getCartRequestLogs);
ReferenceGuideRouter.get("/allCarts", AuthMiddleware, CartController.getAllCarts);
ReferenceGuideRouter.get("/cartRequestDrugs", AuthMiddleware, CartRequestDrugController.getCartRequestDrugs);
