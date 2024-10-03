import {Router} from "express";

import {LogoutMiddleware} from "@middlewares/LogoutMiddleware";
import {publicRouteLimiter} from "@middlewares/RateLimitMiddleware";

import AuthController from "@controllers/AuthController";

export const AuthRouter = Router();

AuthRouter.post("/login", publicRouteLimiter, AuthController.login);
AuthRouter.post("/forgotPassword", AuthController.forgotPassword);
AuthRouter.post("/resetPassword/:resetPasswordToken", AuthController.resetPassword);
AuthRouter.post("/logout", LogoutMiddleware, AuthController.logout);
AuthRouter.get("/admin", LogoutMiddleware, AuthController.getAdmin);
