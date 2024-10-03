import "reflect-metadata";
import "dotenv/config";

import {Command} from "commander";

import {dataSource} from "@infrastructure/Database/mysqlConnection";
import {formularyLevelsProcessorService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

const program = new Command();

program
    .command("bulkAddFormularyLevels")
    .description("Add Formulary levels from csv")
    .action(async () => {
        try {
            const connection = await dataSource.initialize();
            await formularyLevelsProcessorService.bulkAddFormularyLevels();
            await connection.destroy();
        } catch (error) {
            ErrorLog(error, {prefixMessage: AppErrorMessage.BULK_ADD_INVENTORY.PROCESS});
        }
        process.exit(0);
    });

program.parse(process.argv);
