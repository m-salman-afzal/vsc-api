import "reflect-metadata";
import "dotenv/config";

import {Command} from "commander";

import {fileProcessorService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

const program = new Command();

program
    .command("removeSapphireProcessedFiles")
    .description("Remove Sapphire processed files from bucket")
    .action(async () => {
        try {
            await fileProcessorService.removeSapphireProcessedFiles();
        } catch (error) {
            ErrorLog(error, {prefixMessage: AppErrorMessage.REMOVE_BUCKET_PROCESSED_FILES.PROCESS});
        }
        process.exit(0);
    });

program
    .command("removeCloudStorageFiles")
    .requiredOption("--BUCKET <BUCKET>", "BUCKET")
    .requiredOption("--FILE_PREFIX <FILE_PREFIX>", "FILE_PREFIX")
    .description("Remove Sapphire old files from bucket")
    .action(async (args) => {
        try {
            await fileProcessorService.removeCloudStorageFiles({BUCKET: args.BUCKET, FILE_PREFIX: args.FILE_PREFIX});
        } catch (error) {
            ErrorLog(error, {prefixMessage: AppErrorMessage.REMOVE_CLOUD_STORAGE_FILES.PROCESS});
        }
        process.exit(0);
    });

program.parse(process.argv);
