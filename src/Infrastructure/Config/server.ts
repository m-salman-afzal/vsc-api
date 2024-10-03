export const server = {
    PORT: process.env["PORT"] as string,
    APP_NAME: process.env["APP_NAME"] as string,
    NODE_ENV: process.env["NODE_ENV"] as string,
    SECRET: process.env["SECRET"] as string,
    APP_URL: process.env["APP_URL"] as string,
    APP_VERSION: process.env["APP_VERSION"] as string,
    PORTAL_APP_URL: process.env["PORTAL_APP_URL"] as string,
    PORTAL_APP_VERSION: process.env["PORTAL_APP_VERSION"] as string,
    SOCKET_PATH: process.env["SOCKET_PATH"] as string
};
