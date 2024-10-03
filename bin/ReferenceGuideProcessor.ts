import "reflect-metadata";
import "dotenv/config";

import {Command} from "commander";

import {dataSource} from "@infrastructure/Database/mysqlConnection";
import {referenceGuideDrugProcessorService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

const program = new Command();

program
    .command("bulkAddReferenceGuideDrugs")
    .description("Bulk add reference guide drugs")
    .action(async () => {
        try {
            const connection = await dataSource.initialize();
            await referenceGuideDrugProcessorService.execute();
            await connection.destroy();
        } catch (error) {
            ErrorLog(error, {prefixMessage: AppErrorMessage.BULK_ADD_REFERENCE_GUIDE_DRUGS.PROCESS});
        }
        process.exit(0);
    });

program.parse(process.argv);
