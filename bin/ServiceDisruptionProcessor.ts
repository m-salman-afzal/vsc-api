import "reflect-metadata";
import "dotenv/config";

import {Command} from "commander";

import {dataSource} from "@infrastructure/Database/mysqlConnection";
import {serviceDisruptionProcessorService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

const program = new Command();

program
    .command("bulkAddServiceDisruptions")
    .requiredOption("--PROCESS_LABEL <PROCESS_LABEL>", "PROCESS_LABEL")
    .description("Bulk add service disruption incidents")
    .action(async (args) => {
        try {
            const connection = await dataSource.initialize();
            await serviceDisruptionProcessorService.bulkAddServiceDisruption({PROCESS_LABEL: args.PROCESS_LABEL});
            await connection.destroy();
        } catch (error) {
            ErrorLog(error, {prefixMessage: AppErrorMessage.BULK_ADD_SERVICE_DISRUPTION.PROCESS});
        }
        process.exit(0);
    });

program.parse(process.argv);
