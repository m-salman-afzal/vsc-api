import "reflect-metadata";
import "dotenv/config";

import {Command} from "commander";

import {dataSource} from "@infrastructure/Database/mysqlConnection";
import {formularyProcessorService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

const program = new Command();

program
    .command("bulkAddFormulary")
    .description("Bulk add formulary")
    .action(async () => {
        try {
            const connection = await dataSource.initialize();
            await formularyProcessorService.bulkAddFormulary();
            await connection.destroy();
        } catch (error) {
            ErrorLog(error, {prefixMessage: AppErrorMessage.BULK_ADD_FORMULARY.PROCESS});
        }
        process.exit(0);
    });

program.parse(process.argv);
