import {Router} from "express";

export const ApiHealthCheckRouter = Router();

ApiHealthCheckRouter.get("/", (_request, response) => response.status(200).json({message: "healthy"}));
