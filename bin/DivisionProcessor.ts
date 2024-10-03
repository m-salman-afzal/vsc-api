import "reflect-metadata";
import "dotenv/config";

import {Command} from "commander";

import {dataSource} from "@infrastructure/Database/mysqlConnection";
import {divisionService, divisionSwornService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

const program = new Command();

program
    .command("bulkAddDivisions")
    .requiredOption("--DIVISION_LABEL <DIVISION_LABEL>", "DIVISION_LABEL")
    .description("Bulk add divisions")
    .action(async (args) => {
        try {
            const connection = await dataSource.initialize();
            await divisionService.bulkAddDivision({
                DIVISION_LABEL: args.DIVISION_LABEL
            });
            await connection.destroy();
        } catch (error) {
            ErrorLog(error, {prefixMessage: AppErrorMessage.BULK_ADD_DIVISION.PROCESS});
        }
        process.exit(0);
    });

program
    .command("bulkAddAdministrativeDivision")
    .description("Bulk add administrative division")
    .action(async () => {
        try {
            const connection = await dataSource.initialize();
            await divisionService.bulkAddAdministrativeDivision();
            await connection.destroy();
        } catch (error) {
            ErrorLog(error, {prefixMessage: AppErrorMessage.BULK_ADD_ADMINISTRATIVE_DIVISION.PROCESS});
        }
        process.exit(0);
    });

program
    .command("bulkAddSwornPersonnel")
    .description("Bulk add sworn personnel")
    .action(async () => {
        try {
            const connection = await dataSource.initialize();
            await divisionSwornService.bulkAddSwornPersonnel();
            await connection.destroy();
        } catch (error) {
            ErrorLog(error, {prefixMessage: AppErrorMessage.BULK_ADD_ADMINISTRATIVE_DIVISION.PROCESS});
        }
        process.exit(0);
    });

program.parse(process.argv);
