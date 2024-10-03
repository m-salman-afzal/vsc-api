import async from "async";
import {injectable} from "tsyringe";

import {BUCKETS, SAPPHIRE_BUCKET_FOLDERS} from "@constants/CloudStorageConstant";

import {SAPPHIRE_CONFIG} from "@appUtils/Constants";
import SharedUtils from "@appUtils/SharedUtils";

import {cloudStorageUtils, slackUtils} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

import {FileService} from "./FileService";

@injectable()
export class FileProcessorService extends FileService {
    async removeSapphireProcessedFiles() {
        try {
            const filename = `${SAPPHIRE_BUCKET_FOLDERS.PROCESSED}/${SharedUtils.getSubtractedDateForMedPass(
                SAPPHIRE_CONFIG.SAPPHIRE_REMOVE_FILE_DAYS
            )}`;
            const isFilePresent = await cloudStorageUtils.getFilenames(BUCKETS.SAPPHIRE, filename);
            if (!isFilePresent) {
                return await slackUtils.fileNotFound(
                    FileService.name,
                    this.removeSapphireProcessedFiles.name,
                    filename
                );
            }

            await async.eachSeries(isFilePresent, async (filename) => {
                try {
                    await cloudStorageUtils.deleteFile(BUCKETS.SAPPHIRE, filename);
                } catch (error) {
                    ErrorLog(error, {
                        prefixMessage: `${AppErrorMessage.REMOVE_BUCKET_PROCESSED_FILES.PROCESS}${AppErrorMessage.REMOVE_BUCKET_PROCESSED_FILES.DELETE_FAILED}`
                    });
                }
            });

            return true;
        } catch (error) {
            return ErrorLog(error, {
                prefixMessage: `${AppErrorMessage.REMOVE_BUCKET_PROCESSED_FILES.PROCESS}${AppErrorMessage.GET_FILES}`
            });
        }
    }

    async removeCloudStorageFiles(options: {FILE_PREFIX: string; BUCKET: string}) {
        try {
            const filename = options.FILE_PREFIX;
            const isFilePresent = await cloudStorageUtils.getFilenames(options.BUCKET, filename);
            if (!isFilePresent) {
                return await slackUtils.fileNotFound(FileService.name, this.removeCloudStorageFiles.name, filename);
            }

            await async.eachSeries(isFilePresent, async (filename) => {
                try {
                    await cloudStorageUtils.deleteFile(BUCKETS.SAPPHIRE, filename);
                } catch (error) {
                    ErrorLog(error, {
                        prefixMessage: `${AppErrorMessage.REMOVE_CLOUD_STORAGE_FILES.PROCESS}${AppErrorMessage.REMOVE_CLOUD_STORAGE_FILES.DELETE_FAILED}`
                    });
                }
            });

            return true;
        } catch (error) {
            return ErrorLog(error, {
                prefixMessage: `${AppErrorMessage.REMOVE_CLOUD_STORAGE_FILES.PROCESS}${AppErrorMessage.GET_FILES}`
            });
        }
    }
}
