import fs from "fs";

import Client from "ssh2-sftp-client";
import {injectable} from "tsyringe";

import {sftp} from "@infraConfig/index";

import {ErrorLog} from "@logger/ErrorLog";

@injectable()
export class SftpClient {
    private sftpClient: Client;

    constructor() {
        this.sftpClient = new Client();
    }

    private async connect() {
        const connectionMethod = sftp.SFTP_PASSWORD
            ? {password: sftp.SFTP_PASSWORD}
            : {
                  privateKey: fs.readFileSync(sftp.SFTP_PRIVATE_KEY),
                  passphrase: sftp.SFTP_PASSPHRASE
              };

        return await this.sftpClient.connect({
            host: sftp.SFTP_HOST,
            port: sftp.SFTP_PORT,
            username: sftp.SFTP_USERNAME,
            ...connectionMethod,
            readyTimeout: 20000,
            retries: 2,
            retry_factor: 2,
            retry_minTimeout: 2000
        });
    }

    private async disconnect() {
        return await this.sftpClient.end();
    }

    async uploadFile(fileContents: string, filename: string, fileExtension: string) {
        try {
            await this.connect();

            const input = Buffer.from(fileContents);
            await this.sftpClient.put(input, `${sftp.SFTP_PATH}/${filename}.${fileExtension}`);

            return await this.disconnect();
        } catch (error) {
            ErrorLog(error);

            return await this.disconnect();
        }
    }
}
