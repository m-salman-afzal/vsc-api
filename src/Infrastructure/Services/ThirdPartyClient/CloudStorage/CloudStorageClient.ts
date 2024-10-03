import {Storage} from "@google-cloud/storage";
import {injectable} from "tsyringe";

import {FILE_ENCODINGS} from "@constants/FileConstant";

import {CREDENTIALS} from "@appUtils/Constants";

import type {ICloudStorageClient} from "./ICloudStorageClient";
import type {DeleteFileOptions, GetFilesOptions, MoveOptions} from "@google-cloud/storage";

@injectable()
export class CloudStorageClient implements ICloudStorageClient {
    private storage: Storage;

    constructor() {
        this.storage = new Storage({keyFilename: CREDENTIALS.GCP_KEY});
    }

    async generateV4ReadSignedUrl(bucketName: string, filename: string) {
        const [url] = await this.storage
            .bucket(bucketName)
            .file(filename)
            .getSignedUrl({
                version: "v4",
                action: "read",
                expires: Date.now() + 60 * 60 * 100000
            });

        return url;
    }

    async getFilenames(bucketName: string, options?: GetFilesOptions) {
        const [files] = await this.storage.bucket(bucketName).getFiles(options);
        if (files.length === 0) {
            return false;
        }

        return files.map((file) => file.name);
    }

    async downloadFile(bucketName: string, fileName: string, downloadPath: string) {
        return await this.storage.bucket(bucketName).file(fileName).download({destination: downloadPath});
    }

    async renameFile(bucketName: string, srcFileName: string, destFileName: string, moveOptions?: MoveOptions) {
        return await this.storage.bucket(bucketName).file(srcFileName).rename(destFileName, moveOptions);
    }

    async deleteFile(bucketName: string, srcFileName: string, deleteOptions?: DeleteFileOptions) {
        return await this.storage.bucket(bucketName).file(srcFileName).delete(deleteOptions);
    }

    async getFileContent(bucketName: string, fileName: string) {
        const file = this.storage.bucket(bucketName).file(fileName);

        return new Promise<string>((resolve, reject) => {
            const chunks: Buffer[] = [];

            file.createReadStream()
                .on("data", (chunk: Buffer) => {
                    chunks.push(chunk);
                })
                .on("end", () => {
                    const fileContents = Buffer.concat(chunks).toString(FILE_ENCODINGS.UTF8);
                    chunks.length = 0;
                    resolve(fileContents);
                })
                .on("error", (err: Error) => {
                    reject(err);
                });
        });
    }

    async uploadFile(bucketName: string, fileContents: string | Buffer, destFileName: string) {
        const file = this.storage.bucket(bucketName).file(destFileName);

        return new Promise<void>((resolve, reject) => {
            file.createWriteStream({resumable: false})
                .on("error", (error) => {
                    reject(error);
                })
                .on("finish", () => {
                    fileContents = "";
                    resolve();
                })
                .end(fileContents);
        });
    }
}
