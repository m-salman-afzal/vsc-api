import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import AdminUserController from "@controllers/AdminUserController";

export const AdminUserRouter = Router();

AdminUserRouter.get("/", AuthMiddleware, AdminUserController.getAdminUsers);
AdminUserRouter.post("/add", AuthMiddleware, AdminUserController.addAdminUser);
AdminUserRouter.put("/edit/:adminId", AuthMiddleware, AdminUserController.updateAdminUser);
AdminUserRouter.delete("/remove/:adminId", AuthMiddleware, AdminUserController.removeAdminUser);

AdminUserRouter.put("/profile", AuthMiddleware, AdminUserController.updateAdminUserProfile);
AdminUserRouter.put("/password", AuthMiddleware, AdminUserController.updateAdminUserPassword);
AdminUserRouter.post("/validatePassword", AuthMiddleware, AdminUserController.validateAdminUserPassword);
