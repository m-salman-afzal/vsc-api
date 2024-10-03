import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";


import {CartInventoryController} from "@controllers/CartInventoryController";
import {CartInventoryLogsController} from "@controllers/CartInventoryLogsController";
import {CartInventoryLogsDrugController} from "@controllers/CartInventoryLogsDrugController";
import {PerpetualInventoryController} from "@controllers/PerpetualInventoryController";
import {ShiftCountController} from "@controllers/ShiftCountController";
import {ShiftCountLogDrugsController} from "@controllers/ShiftCountLogDrugsController";
import {ShiftCountLogsController} from "@controllers/ShiftCountLogsController";

export const ControlLogBookAdministerRoutes = Router();

ControlLogBookAdministerRoutes.get("/cartInventory", AuthMiddleware, CartInventoryController.getCartInventory);
ControlLogBookAdministerRoutes.get("/cartInventory/getCarts", AuthMiddleware, PerpetualInventoryController.getCarts);

ControlLogBookAdministerRoutes.post(
    "/cartInventoryLogsDrug",
    AuthMiddleware,
    CartInventoryLogsController.addCartInventoryLog
);

ControlLogBookAdministerRoutes.get(
    "/cartInventoryLogsDrug",
    AuthMiddleware,
    CartInventoryLogsController.getCartInventoryLogs
);

ControlLogBookAdministerRoutes.get(
    "/cartInventoryLogsDrug/getCarts",
    AuthMiddleware,
    CartInventoryLogsController.getCarts
);

ControlLogBookAdministerRoutes.get(
    "/cartInventoryLogsDrug/:cartInventoryLogsId",
    AuthMiddleware,
    CartInventoryLogsDrugController.getCartInventoryLogs
);

ControlLogBookAdministerRoutes.get("/shiftCountLogs", AuthMiddleware, ShiftCountLogsController.getShiftCountLogs);
ControlLogBookAdministerRoutes.post("/shiftCountLogs", AuthMiddleware, ShiftCountLogsController.addShiftCountLogs);

ControlLogBookAdministerRoutes.get(
    "/shiftCountLogDrugs",
    AuthMiddleware,
    ShiftCountLogDrugsController.getShiftCountLogDrugs
);
ControlLogBookAdministerRoutes.get("/shiftCounts", AuthMiddleware, ShiftCountController.getShiftCount);
ControlLogBookAdministerRoutes.get("/shiftCounts/getCarts", AuthMiddleware, ShiftCountController.getCarts);
