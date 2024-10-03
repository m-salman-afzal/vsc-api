export const rateLimiter = {
    MAX_RATE_LIMIT_SECONDS: Number(process.env["MAX_RATE_LIMIT_SECONDS"]),
    MAX_RATE_LIMIT_REQUESTS: Number(process.env["MAX_RATE_LIMIT_REQUESTS"])
};
