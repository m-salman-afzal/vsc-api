import {inject, injectable} from "tsyringe";

import type {ICloudStorageClient} from "@infraServices/ThirdPartyClient/CloudStorage/ICloudStorageClient";

@injectable()
export class CloudStorageUtils {
    constructor(@inject("ICloudStorageClient") private cloudStorageClient: ICloudStorageClient) {}

    async generateV4ReadSignedUrl(bucket: string, filename: string) {
        return await this.cloudStorageClient.generateV4ReadSignedUrl(bucket, filename);
    }
    async getFilenames(bucket: string, filename: string) {
        return await this.cloudStorageClient.getFilenames(bucket, {prefix: filename});
    }

    async renameFile(bucket: string, srcFilename: string, destFilename: string) {
        return await this.cloudStorageClient.renameFile(bucket, srcFilename, destFilename);
    }

    async getFileContent(bucket: string, filename: string) {
        return await this.cloudStorageClient.getFileContent(bucket, filename);
    }

    async downloadFile(bucket: string, filename: string, downloadPath: string) {
        return await this.cloudStorageClient.downloadFile(bucket, filename, downloadPath);
    }

    async uploadFile(bucket: string, fileContent: string | Buffer, filename: string) {
        return await this.cloudStorageClient.uploadFile(bucket, fileContent, filename);
    }

    async deleteFile(bucket: string, filename: string) {
        return await this.cloudStorageClient.deleteFile(bucket, filename);
    }
}
