import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {DiscrepancyLogController} from "@controllers/DiscrepancyLogController";
import {PerpetualInventoryController} from "@controllers/PerpetualInventoryController";
import {PerpetualInventoryDeductionController} from "@controllers/PerpetualInventoryDeductionController";

export const PerpetualInventoryRouter = Router();

PerpetualInventoryRouter.get("/", AuthMiddleware, PerpetualInventoryController.getPerpetualInventory);
PerpetualInventoryRouter.get("/getCarts", AuthMiddleware, PerpetualInventoryController.getCarts);
PerpetualInventoryRouter.get(
    "/getSignature",
    AuthMiddleware,
    PerpetualInventoryController.getPerpetualInventorySignature
);
PerpetualInventoryRouter.put(
    "/:perpetualInventoryId",
    AuthMiddleware,
    PerpetualInventoryController.updatePerpetualInventory
);
PerpetualInventoryRouter.put(
    "/addDeduction/:perpetualInventoryId",
    AuthMiddleware,
    PerpetualInventoryController.addPerpetualInventoryDeduction
);
PerpetualInventoryRouter.put(
    "/addSignature/:perpetualInventoryId",
    AuthMiddleware,
    PerpetualInventoryController.addStaffSignature
);
PerpetualInventoryRouter.delete(
    "/:perpetualInventoryId",
    AuthMiddleware,
    PerpetualInventoryController.removePerpetualInventory
);
PerpetualInventoryRouter.get("/getAll", AuthMiddleware, PerpetualInventoryController.getAllPerpetualInventory);

PerpetualInventoryRouter.delete(
    "/deductions/:perpetualInventoryDeductionId",
    AuthMiddleware,
    PerpetualInventoryDeductionController.removePerpInvDeduction
);

PerpetualInventoryRouter.put(
    "/deductions/:perpetualInventoryDeductionId",
    AuthMiddleware,
    PerpetualInventoryDeductionController.updatePerpInvDeduction
);

PerpetualInventoryRouter.get("/discrepancyLogs/", AuthMiddleware, DiscrepancyLogController.getDiscrepancyLog);
PerpetualInventoryRouter.put(
    "/unarchive/:perpetualInventoryId",
    AuthMiddleware,
    PerpetualInventoryController.unarchivePerpetualInventory
);
