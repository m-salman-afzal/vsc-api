import type {
    TDeleteFileOptions,
    TDeleteResponse,
    TDownloadResponse,
    TFileContent,
    TGetFilesOptions,
    TMoveOptions,
    TMoveResponse,
    TUploadResponse
} from "@typings/CloudStorageClient";

export interface ICloudStorageClient {
    generateV4ReadSignedUrl(bucketName: string, filename: string): Promise<string>;
    getFilenames(bucketName: string, options?: TGetFilesOptions): Promise<string[] | false>;
    downloadFile(bucketName: string, fileName: string, downloadPath: string): TDownloadResponse;
    renameFile(
        bucketName: string,
        srcFileName: string,
        destFileName: string,
        moveOptions?: TMoveOptions
    ): TMoveResponse;
    deleteFile(bucketName: string, srcFileName: string, deleteOptions?: TDeleteFileOptions): TDeleteResponse;
    uploadFile(bucketName: string, fileContents: string | Buffer, destFileName: string): TUploadResponse;
    getFileContent(bucketName: string, fileName: string): TFileContent;
}
