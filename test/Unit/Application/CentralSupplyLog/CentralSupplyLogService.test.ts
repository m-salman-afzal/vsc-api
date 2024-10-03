import "reflect-metadata";
import "dotenv/config";

import {ok, strictEqual} from "node:assert";
import {describe, it, mock} from "node:test";

import {centralSupplyLogService, formularyService} from "test/Unit/Infrastructure/DIContainer";

import {AdminEntity} from "@entities/Admin/AdminEntity";

import HttpResponse from "@appUtils/HttpResponse";

import {formularyWithInventoryAndLevel} from "./MockedValues";

describe("Central Supply Log Service", () => {
    describe("getCentralSupplyDrugs", () => {
        it("it should return HttpResponse 404 status code", async () => {
            mock.method(formularyService, "fetchPaginatedWithLevelAndInventory", () => false);

            const response = await centralSupplyLogService.getCentralSupplyDrugs({}, {currentPage: 1, perPage: 10});

            strictEqual(response.statusCode, 404);
            strictEqual(typeof response.body, "object");
            ok(response instanceof HttpResponse);
        });

        it("it should return current facility formularyLevel", () => {
            const formularyLevel = [
                {
                    facilityId: "asd"
                },
                {
                    facilityId: "qwe"
                }
            ];

            const data = centralSupplyLogService.currentFacilityFormularLevel(formularyLevel as never, {
                facilityId: "asd"
            });

            strictEqual(data.facilityId, "asd");
        });

        it("it should return calculated orderedQuantity", () => {
            const formularyLevel = {
                parLevel: 20,
                orderedQuantity: 10
            };
            const totalQuantity = 5;

            const data = centralSupplyLogService.calculateOrderedQuantity(formularyLevel as never, totalQuantity);

            strictEqual(data, 5);
        });

        it("it should return calculated orderedQuantity", () => {
            const formularyLevel = {
                parLevel: 20,
                orderedQuantity: 10
            };

            const data = centralSupplyLogService.calculateOrderedQuantity(formularyLevel as never, 5);

            strictEqual(data, 5);
        });

        it("it should return paginated centralSupplyDrugs", () => {
            const [data] = centralSupplyLogService.paginatedCentralSupplyDrugsEntity(
                formularyWithInventoryAndLevel as never,
                {facilityId: "asd"}
            );

            ok(typeof data === "object");
            ok(Object.hasOwn(data, "formulary"));
            ok(Object.hasOwn(data, "orderedQuantity"));
            ok(Object.hasOwn(data, "totalQuantity"));
            ok(Object.hasOwn(data.formulary, "formularyLevel"));
        });
    });

    describe("mergeOrderedQuantities", () => {
        it("it should merge ordered quantities when calculated ordered quantity is defined", () => {
            const orderedQuantity = {
                orderedQuantityMin: 10,
                orderedQuantityMax: 20
            };

            const calculatedOrderedQuantity = {
                orderedQuantityMin: 5,
                orderedQuantityMax: 15
            };

            const mergedQuantities = centralSupplyLogService.mergeOrderedQuantities(
                orderedQuantity,
                calculatedOrderedQuantity
            );

            strictEqual(mergedQuantities.orderedQuantityMin, 10);
            strictEqual(mergedQuantities.orderedQuantityMax, 20);
            strictEqual(mergedQuantities.calculatedOrderedQuantityMin, 5);
            strictEqual(mergedQuantities.calculatedOrderedQuantityMax, 15);
        });

        it("it should merge ordered quantities when calculated ordered quantity is undefined", () => {
            const orderedQuantity = {
                orderedQuantityMin: 10,
                orderedQuantityMax: 20
            };

            const mergedQuantities = centralSupplyLogService.mergeOrderedQuantities(orderedQuantity, undefined);

            strictEqual(mergedQuantities.orderedQuantityMin, 10);
            strictEqual(mergedQuantities.orderedQuantityMax, 20);
            strictEqual(mergedQuantities.calculatedOrderedQuantityMin, undefined);
            strictEqual(mergedQuantities.calculatedOrderedQuantityMax, undefined);
        });
    });

    describe("getCentralSupplyLogs", () => {
        it("should create an array of central supply log entities", () => {
            const centralSupplyLogs = [
                {
                    centralSupplyLogId: "1",
                    createdAt: "2021-09-01T00:00:00.000Z",
                    admin: {
                        adminId: "admin1",
                        name: "John Doe",
                        password: "password"
                    }
                },
                {
                    centralSupplyLogId: "2",
                    createdAt: "2021-09-01T00:00:00.000Z",
                    admin: {
                        adminId: "admin2",
                        name: "Jane Smith",
                        password: "password"
                    }
                }
            ];

            const [centralSupplyLogsEntities] = centralSupplyLogService.createCentralSupplyLogsEntities(
                centralSupplyLogs as never
            );

            ok(centralSupplyLogsEntities?.centralSupplyLog.admin instanceof AdminEntity);
            ok(Object.hasOwn(centralSupplyLogsEntities.centralSupplyLog, "createdAt"));
            ok(Object.hasOwn(centralSupplyLogsEntities.centralSupplyLog, "centralSupplyLogId"));
        });
    });
});
