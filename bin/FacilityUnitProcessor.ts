import "reflect-metadata";
import "dotenv/config";

import {Command} from "commander";

import {dataSource} from "@infrastructure/Database/mysqlConnection";
import {facilityUnitProcessorService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

const program = new Command();

program
    .command("bulkAddUnits")
    .description("Bulk add units")
    .action(async () => {
        try {
            const connection = await dataSource.initialize();
            await facilityUnitProcessorService.bulkAddUnits();
            await connection.destroy();
        } catch (error) {
            ErrorLog(error, {prefixMessage: AppErrorMessage.BULK_ADD_LOCATIONS.PROCESS});
        }
        process.exit(0);
    });

program.parse(process.argv);
