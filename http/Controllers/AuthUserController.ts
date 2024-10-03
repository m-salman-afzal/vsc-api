import {cookieOptions} from "@server/bootstrap";

import {COOKIE_CONFIG} from "@constants/AuthConstant";

import AuthUserValidation from "@validations/AuthUserValidation";

import {HttpStatusCode} from "@appUtils/Http";
import HttpResponse from "@appUtils/HttpResponse";

import ForgotPasswordDTO from "@application/Auth/DTOs/ForgotPasswordDTO";
import LoginDTO from "@application/Auth/DTOs/LoginDTO";
import ResetPasswordDTO from "@application/Auth/DTOs/ResetPasswordDTO";

import {authUserService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

class AuthUserController {
    static async login(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            AuthUserValidation.loginValidation(body);
            const loginDTO = LoginDTO.create(body);
            const httpResponse = await authUserService.login(loginDTO, request);
            if (httpResponse.statusCode === HttpStatusCode.OK && "admin" in httpResponse.body) {
                response = HttpResponse.setCookies(response, [
                    {
                        name: "session",
                        value: httpResponse.body.admin,
                        options: {...cookieOptions, httpOnly: false}
                    }
                ]);

                return HttpResponse.convertToExpress(response, httpResponse);
            }

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async forgotPassword(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            AuthUserValidation.forgotPasswordValidation(body);
            const forgotPasswordDTO = ForgotPasswordDTO.create(body);
            const httpResponse = await authUserService.forgotPassword(forgotPasswordDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async resetPassword(request: TRequest, response: TResponse) {
        try {
            const {body, params} = request;
            AuthUserValidation.resetPasswordValidation({...body, ...params});
            const resetPasswordDTO = ResetPasswordDTO.create({...body, ...params});
            const httpResponse = await authUserService.resetPassword(resetPasswordDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async logout(request: TRequest, response: TResponse) {
        try {
            const {admin} = request;
            const httpResponse = await authUserService.logout(admin?.adminId);
            request.session.destroy((error) => {
                !!error;
            });
            response = HttpResponse.clearCookies(response, [
                {name: COOKIE_CONFIG.AUTH_COOKIE},
                {name: COOKIE_CONFIG.SESSION_COOKIE}
            ]);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}

export default AuthUserController;
