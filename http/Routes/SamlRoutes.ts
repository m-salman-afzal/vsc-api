import {Router} from "express";
import passport from "passport";

import {SamlController} from "@controllers/SamlController";

import {HttpMessages} from "@appUtils/Http";

export const SamlRouter = Router();

SamlRouter.get(
    "/login",
    passport.authenticate("saml", {
        failureMessage: HttpMessages.INVALID_CREDS
    })
);

SamlRouter.post(
    "/auth",
    passport.authenticate("saml", {
        failureMessage: HttpMessages.INVALID_CREDS
    }),
    SamlController.login
);
