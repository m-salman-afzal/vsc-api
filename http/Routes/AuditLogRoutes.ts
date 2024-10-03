import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {AuditLogController} from "@controllers/AuditLogController";

export const AuditLogRouter = Router();

AuditLogRouter.get("/", AuthMiddleware, AuditLogController.getAuditLogs);
AuditLogRouter.get("/search", AuthMiddleware, AuditLogController.searchAuditLogs);
