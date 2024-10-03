import {pino} from "pino";
import {injectable} from "tsyringe";

import {CREDENTIALS, NODE_ENV, SERVER_CONFIG} from "@appUtils/Constants";

type TGcpLoggingOptions = {keyFilename: string};

type TTransportTarget =
    | {
          target: string;
          options: {logName: string; cloudLoggingOptions: {googleCloudOptions: TGcpLoggingOptions}};
      }
    | {target: string};

type TTransport = {
    targets: TTransportTarget[];
};

@injectable()
export class Logger {
    private gcpLoggingOptions: TGcpLoggingOptions;

    private gcpLoggingTranport: {
        target: string;
        options: {cloudLoggingOptions: {googleCloudOptions: TGcpLoggingOptions}};
    };

    private consoleTransport: {target: string};

    private transport: TTransport;

    constructor() {
        this.gcpLoggingOptions = this.setGcpLoggingOptions();
        this.gcpLoggingTranport = this.setGcpLoggingTranport();
        this.consoleTransport = this.setConsoleTransport();
        this.transport = this.setTransport();
    }

    private setGcpLoggingOptions() {
        return {
            keyFilename: CREDENTIALS.GCP_LOGGING_KEY
        };
    }

    private setGcpLoggingTranport() {
        return {
            target: "cloud-pine",
            options: {
                cloudLoggingOptions: {
                    googleCloudOptions: this.gcpLoggingOptions
                }
            }
        };
    }

    private setConsoleTransport() {
        return {target: "pino-pretty"};
    }

    private setTransport() {
        return SERVER_CONFIG.NODE_ENV === NODE_ENV.PROD
            ? {targets: [this.gcpLoggingTranport]}
            : {targets: [this.gcpLoggingTranport, this.consoleTransport]};
    }

    info(message: string, prefix?: string) {
        return pino({
            level: "info",
            transport: this.transport,
            msgPrefix: prefix ? `[${prefix}] ` : "[INFO] "
        }).info(message);
    }

    warn(message: string, prefix?: string) {
        return pino({
            level: "warn",
            transport: this.transport,
            msgPrefix: prefix ? `[${prefix}] ` : "[WARN] "
        }).warn(message);
    }

    error(message: string, errorObject: object, prefix?: string) {
        return pino({
            level: "error",
            transport: this.transport,
            msgPrefix: prefix ? `[${prefix}] ` : "[ERROR] "
        }).error(errorObject, message);
    }
}
