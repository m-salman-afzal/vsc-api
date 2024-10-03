import "reflect-metadata";
import "dotenv/config";

import {Command} from "commander";

import {dataSource} from "@infrastructure/Database/mysqlConnection";
import {historyPhysicalService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

const program = new Command();

program
    .command("sapphireHistoryPhysical")
    .option("--FILE_PREFIX <FILE_PREFIX>", "FILE_PREFIX")
    .option("--PROCESS_LABEL <PROCESS_LABEL>", "PROCESS_LABEL")
    .description("Get date from sapphire, clean and save to database")
    .action(async (args) => {
        try {
            const connection = await dataSource.initialize();
            await historyPhysicalService.processHistoryPhysicalRecord({
                FILE_PREFIX: args.FILE_PREFIX,
                PROCESS_LABEL: args.PROCESS_LABEL
            });
            await connection.destroy();
        } catch (error) {
            ErrorLog(error, {prefixMessage: AppErrorMessage.HISTORY_PHYSICAL.PROCESS});
        }
        process.exit(0);
    });
