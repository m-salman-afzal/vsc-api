import "reflect-metadata";
import "dotenv/config";

import {Command} from "commander";

import {dataSource} from "@infrastructure/Database/mysqlConnection";
import {medicationListService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

const program = new Command();

program
    .command("addMedicationList")
    .option("--FILE_PREFIX <FILE_PREFIX>", "FILE_PREFIX")
    .description("Add Medication filename")
    .action(async (args) => {
        try {
            const connection = await dataSource.initialize();
            await medicationListService.addMedicationList({FILE_PREFIX: args.FILE_PREFIX});
            await connection.destroy();
        } catch (error) {
            ErrorLog(error, {prefixMessage: AppErrorMessage.ADD_MEDICATION_LIST.PROCESS});
        }
        process.exit(0);
    });

program.parse(process.argv);
