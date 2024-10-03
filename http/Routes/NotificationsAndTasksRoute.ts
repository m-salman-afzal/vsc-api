import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {NotificationController} from "@controllers/NotificationController";

export const NotificationsAndTasksRouter = Router();

NotificationsAndTasksRouter.get("/", AuthMiddleware, NotificationController.getNotification);

NotificationsAndTasksRouter.get("/facilities", AuthMiddleware, NotificationController.getFacilities);

NotificationsAndTasksRouter.put("/markAsRead/:notificationAdminId", AuthMiddleware, NotificationController.markAsRead);

NotificationsAndTasksRouter.put("/archive/:notificationAdminId", AuthMiddleware, NotificationController.markAsArchive);
