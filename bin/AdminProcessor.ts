import "reflect-metadata";
import "dotenv/config";

import {Command} from "commander";

import {dataSource} from "@infrastructure/Database/mysqlConnection";
import {redisClient} from "@infrastructure/Database/RedisConnection";
import {adminProcessorService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

const program = new Command();

program
    .command("bulkUpsertAdmins")
    .description("Bulk upsert admins")
    .action(async () => {
        try {
            const databaseConnection = await dataSource.initialize();
            const redisConnection = await redisClient.connect();

            await adminProcessorService.bulkUpsertAdmins();
            await databaseConnection.destroy();
            await redisConnection.disconnect();
        } catch (error) {
            ErrorLog(error, {prefixMessage: AppErrorMessage.BULK_UPSERT_ADMINS.PROCESS});
        }
        process.exit(0);
    });

program.parse(process.argv);
