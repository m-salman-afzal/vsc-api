import {ZodError} from "zod";
import {fromZodError} from "zod-validation-error";

import {logger} from "@infrastructure/DIContainer/Resolver";

type TErrorParams = {
    prefixMessage?: string;
};

const zodError = (error: ZodError) => {
    const errorMessage = fromZodError(error, {
        prefix: "",
        prefixSeparator: "",
        issueSeparator: "\n"
    });
    logger.warn(errorMessage.toString(), "VALIDATION_ERROR");

    return JSON.parse(JSON.stringify(error));
};

const serverError = (error: Error, params?: TErrorParams) => {
    logger.error(error.message, error, params?.prefixMessage);

    return error.message;
};

export const ErrorLog = (error: unknown, params?: TErrorParams) => {
    if (error instanceof ZodError) {
        return zodError(error);
    }

    if (error instanceof Error) {
        return serverError(error, params);
    }

    return "";
};
