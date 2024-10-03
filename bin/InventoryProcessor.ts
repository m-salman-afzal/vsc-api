import "reflect-metadata";
import "dotenv/config";

import {Command} from "commander";

import {dataSource} from "@infrastructure/Database/mysqlConnection";
import {inventoryProcessorService} from "@infrastructure/DIContainer/Resolver";

import {AppErrorMessage} from "@logger/AppErrorMessage";
import {ErrorLog} from "@logger/ErrorLog";

const program = new Command();

program
    .command("bulkAddNonControlledInventory")
    .description("Add Inventory from csv")
    .action(async () => {
        try {
            const connection = await dataSource.initialize();
            await inventoryProcessorService.bulkAddNonControlledInventory();
            await connection.destroy();
        } catch (error) {
            ErrorLog(error, {prefixMessage: AppErrorMessage.BULK_ADD_INVENTORY.PROCESS});
        }
        process.exit(0);
    });

program
    .command("bulkAddControlledInventory")
    .description("Add Inventory from csv")
    .action(async () => {
        try {
            const connection = await dataSource.initialize();
            await inventoryProcessorService.bulkAddControlledInventoru();
            await connection.destroy();
        } catch (error) {
            ErrorLog(error, {prefixMessage: AppErrorMessage.BULK_ADD_INVENTORY.PROCESS});
        }
        process.exit(0);
    });

program
    .command("deactivateExpiredInventory")
    .description("Check expiry with quantity and deactivate it")
    .action(async () => {
        try {
            const connection = await dataSource.initialize();
            await inventoryProcessorService.deactivateExpiredInventory();
            await connection.destroy();
        } catch (error) {
            ErrorLog(error, {prefixMessage: AppErrorMessage.BULK_DEDUCT_INVENTORY_WHEN_EXPIRED_OR_DEPLETED.PROCESS});
        }
        process.exit(0);
    });

program.parse(process.argv);
