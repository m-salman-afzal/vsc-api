import rateLimit from "express-rate-limit";
import RateLimitStore from "rate-limit-redis";

import {HttpMessages, HttpStatus} from "@appUtils/Http";

import {rateLimiter} from "@infraConfig/index";

import {redisClient} from "@infrastructure/Database/RedisConnection";

import {ErrorLog} from "@logger/ErrorLog";

redisClient.connect().catch((error) => {
    ErrorLog(error, {prefixMessage: "REDIS_ERROR"});
});

export const publicRouteLimiter = rateLimit({
    windowMs: rateLimiter.MAX_RATE_LIMIT_SECONDS * 1000,
    max: rateLimiter.MAX_RATE_LIMIT_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    store: new RateLimitStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
        prefix: "fchRateLimiter:"
    }),
    message: {
        status: HttpStatus.ERROR,
        message: HttpMessages.TOO_MANY_REQUESTS
    }
});
