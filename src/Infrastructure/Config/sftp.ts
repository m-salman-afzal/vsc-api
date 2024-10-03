import path from "path";

export const sftp = {
    SFTP_HOST: process.env["SFTP_HOST"] as string,
    SFTP_PORT: Number(process.env["SFTP_PORT"]),
    SFTP_USERNAME: process.env["SFTP_USERNAME"] as string,
    SFTP_PASSWORD: process.env["SFTP_PASSWORD"] as string,
    SFTP_PATH: process.env["SFTP_PATH"] as string,
    SFTP_PRIVATE_KEY: path.resolve(
        __dirname,
        `../../Infrastructure/Services/ThirdPartyClient/Credentials/${process.env["SFTP_PRIVATE_KEY"]}`
    ),
    SFTP_PASSPHRASE: process.env["SFTP_PASSPHRASE"] as string
};
