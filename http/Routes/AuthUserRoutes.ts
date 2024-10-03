import {Router} from "express";

import {LogoutMiddleware} from "@middlewares/LogoutMiddleware";

import AuthUserController from "@controllers/AuthUserController";

export const AuthUserRouter = Router();

AuthUserRouter.post("/login", AuthUserController.login);
AuthUserRouter.post("/forgotPassword", AuthUserController.forgotPassword);
AuthUserRouter.post("/resetPassword/:resetPasswordToken", AuthUserController.resetPassword);
AuthUserRouter.post("/logout", LogoutMiddleware, AuthUserController.logout);
