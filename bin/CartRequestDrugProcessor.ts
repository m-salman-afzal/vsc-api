import "reflect-metadata";
import "dotenv/config";

import {Command} from "commander";

import {dataSource} from "@infrastructure/Database/mysqlConnection";
import {cartRequestDrugProcessorService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

const program = new Command();

program.command("cartInitialAllocation").action(async () => {
    try {
        const databaseConnection = await dataSource.initialize();
        await cartRequestDrugProcessorService.initialAllocation();
        await databaseConnection.destroy();
    } catch (error) {
        ErrorLog(error, {prefixMessage: AppErrorMessage.BULK_UPSERT_ADMINS.PROCESS});
    }
    process.exit(0);
});

program.parse(process.argv);
