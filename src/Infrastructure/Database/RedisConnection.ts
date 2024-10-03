import {createClient} from "redis";

import {redis} from "@infraConfig/index";

export const redisClient = createClient({
    url: `redis://${redis.REDIS_HOST}:${redis.REDIS_PORT}`,
    password: redis.REDIS_PASSWORD,
    database: Number(redis.REDIS_DB_NUMBER)
});
