import "reflect-metadata";
import "dotenv/config";

import {Command} from "commander";

import {dataSource} from "@infrastructure/Database/mysqlConnection";
import {inventoryHistoryProcessorService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

const program = new Command();

program
    .command("uploadInventoryHistory")
    .description("Upload inventory history for today")
    .action(async () => {
        try {
            const databaseConnection = await dataSource.initialize();
            await inventoryHistoryProcessorService.uploadInventory();
            await databaseConnection.destroy();
        } catch (error) {
            ErrorLog(error, {prefixMessage: AppErrorMessage.BULK_UPSERT_ADMINS.PROCESS});
        }
        process.exit(0);
    });

program.parse(process.argv);
