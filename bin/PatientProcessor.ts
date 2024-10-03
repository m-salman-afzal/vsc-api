import "reflect-metadata";
import "dotenv/config";

import {Command} from "commander";

import {dataSource} from "@infrastructure/Database/mysqlConnection";
import {patientService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

const program = new Command();

program
    .command("bulkUpsertPatients")
    .option("--FILE_PREFIX <FILE_PREFIX>", "FILE_PREFIX")
    .description("Bulk upsert patients")
    .action(async (args) => {
        try {
            const connection = await dataSource.initialize();
            await patientService.bulkUpsertPatients({FILE_PREFIX: args.FILE_PREFIX});
            await connection.destroy();
        } catch (error) {
            ErrorLog(error, {prefixMessage: AppErrorMessage.BULK_ADD_PATIENTS.PROCESS});
        }
        process.exit(0);
    });

program.parse(process.argv);
