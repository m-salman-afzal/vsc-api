import SessionStore from "connect-redis";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import passport from "passport";

import type {CookieOptions} from "express";

import "@middlewares/SamlMiddleware";

import {NODE_ENV, SERVER_CONFIG} from "@appUtils/Constants";

import {auth} from "@infraConfig/index";

import {redisClient} from "@infrastructure/Database/RedisConnection";

const limit = {
    limit: "50mb",
    extended: true
};

export const sessionStore = new SessionStore({
    client: redisClient,
    prefix: "fchSession:"
});

export const cookieOptions: CookieOptions = {
    secure: false,
    httpOnly: false,
    maxAge: auth.SESSION_MAXAGE * 1000,
    signed: true,
    sameSite: true
};

const corsOptions =
    SERVER_CONFIG.NODE_ENV === NODE_ENV.PROD ? {} : {origin: [SERVER_CONFIG.APP_URL], credentials: true};

export const bootstrap = express();

bootstrap.use(express.json(limit));

bootstrap.use(express.urlencoded(limit));

bootstrap.use(cors(corsOptions));

bootstrap.use(
    session({
        store: sessionStore,
        saveUninitialized: false,
        resave: false,
        secret: SERVER_CONFIG.SECRET,
        unset: "destroy",
        cookie: cookieOptions
    })
);

bootstrap.use(passport.initialize());

bootstrap.use(passport.session());

bootstrap.use(cookieParser(SERVER_CONFIG.SECRET));

bootstrap.set("trust proxy", 1);
