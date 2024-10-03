import type {
    DeleteFileOptions,
    DownloadResponse,
    GetFilesOptions,
    MoveOptions,
    MoveResponse
} from "@google-cloud/storage";
import type {TResponse} from "@typings/Express";

export type TGetFilesOptions = GetFilesOptions;

export type TMoveOptions = MoveOptions;

export type TDeleteFileOptions = DeleteFileOptions;

export type TDownloadResponse = Promise<DownloadResponse>;

export type TMoveResponse = Promise<MoveResponse>;

export type TDeleteResponse = Promise<[TResponse<unknown>]>;

export type TUploadResponse = Promise<void>;

export type TFileContent = Promise<string>;
