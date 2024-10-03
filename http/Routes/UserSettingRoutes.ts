import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {UserSettingController} from "@controllers/UserSettingController";

export const UserSettingRouter = Router();

UserSettingRouter.post("/", AuthMiddleware, UserSettingController.addUserSetting);
UserSettingRouter.get("/", AuthMiddleware, UserSettingController.getUserSettings);
UserSettingRouter.put("/:userSettingId", AuthMiddleware, UserSettingController.updateUserSetting);
