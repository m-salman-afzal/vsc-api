export const database = {
    DB: process.env["DB_NAME"] as string,
    USERNAME: process.env["DB_USERNAME"] as string,
    PASSWORD: process.env["DB_PASSWORD"] as string,
    HOST: process.env["DB_HOST"] as string,
    PORT: process.env["DB_PORT"] as string,
    SYNCHRONIZE: process.env["DB_SYNCHRONIZE"] as string,
    LOGGING: process.env["DB_LOGGING"] as string
};
