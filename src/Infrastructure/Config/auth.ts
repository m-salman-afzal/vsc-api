export const auth = {
    PASSWORD_EXPIRY_DAYS: Number(process.env["PASSWORD_EXPIRY_DAYS"]),
    MAX_LOGIN_TRIES: Number(process.env["MAX_LOGIN_TRIES"]),
    SESSION_MAXAGE: Number(process.env["SESSION_MAXAGE"])
};
