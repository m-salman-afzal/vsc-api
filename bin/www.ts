import "reflect-metadata";
import "dotenv/config";

import EventEmitter from "events";
import fs from "fs";
import https from "https";

import {bootstrap} from "@http/Server";
import {RBAC_SERVICES} from "@http/Server/rbacServices";
import {io} from "@http/WebSocket/wsServer";

import {DEV_CONFIG, NODE_ENV, SERVER_CONFIG} from "@appUtils/Constants";

import {dataSource} from "@infrastructure/Database/mysqlConnection";
import {logger, serviceListService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

(async () => {
    try {
        EventEmitter.setMaxListeners(20);

        await dataSource.initialize();

        const config =
            SERVER_CONFIG.NODE_ENV === NODE_ENV.PROD
                ? bootstrap.listen(Number(SERVER_CONFIG.PORT), "0.0.0.0", () => {
                      logger.info(`PROD Server running on port ${SERVER_CONFIG.PORT}`);
                  })
                : https
                      .createServer(
                          {
                              key: fs.readFileSync(DEV_CONFIG.DEV_SERVER_KEY_PATH),
                              cert: fs.readFileSync(DEV_CONFIG.DEV_SERVER_CERT_PATH)
                          },
                          bootstrap
                      )
                      .listen(Number(SERVER_CONFIG.PORT), "0.0.0.0", () => {
                          logger.info(`DEV Server running on port ${SERVER_CONFIG.PORT}`);
                      });

        await serviceListService.addRbacServiceLists(Object.values(RBAC_SERVICES));
        io.listen(config, {path: SERVER_CONFIG.SOCKET_PATH});
    } catch (error) {
        ErrorLog(error);
    }
})();
