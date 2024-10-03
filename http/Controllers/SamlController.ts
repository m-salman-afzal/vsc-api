import {APP_URLS} from "@appUtils/Constants";
import {HttpStatusCode} from "@appUtils/Http";
import HttpResponse from "@appUtils/HttpResponse";

import {samlService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class SamlController {
    static async login(request: TRequest, response: TResponse) {
        try {
            const httpResponse = await samlService.login(request);
            if (httpResponse.statusCode === HttpStatusCode.OK && "admin" in httpResponse.body) {
                return HttpResponse.redirect(response, APP_URLS.APP_URL);
            }

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
