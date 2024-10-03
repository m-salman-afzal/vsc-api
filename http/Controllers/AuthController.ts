import {COOKIE_CONFIG} from "@constants/AuthConstant";

import AuthValidation from "@validations/AuthValidation";

import HttpResponse from "@appUtils/HttpResponse";

import ForgotPasswordDTO from "@application/Auth/DTOs/ForgotPasswordDTO";
import LoginDTO from "@application/Auth/DTOs/LoginDTO";
import ResetPasswordDTO from "@application/Auth/DTOs/ResetPasswordDTO";

import {authService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AdminEntity} from "@entities/Admin/AdminEntity";
import type {TRequest, TResponse} from "@typings/Express";

class AuthController {
    static async login(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            AuthValidation.loginValidation(body);
            const loginDTO = LoginDTO.create(body);
            const httpResponse = await authService.login(loginDTO, request);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async forgotPassword(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            AuthValidation.forgotPasswordValidation(body);
            const forgotPasswordDTO = ForgotPasswordDTO.create(body);
            const httpResponse = await authService.forgotPassword(forgotPasswordDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async resetPassword(request: TRequest, response: TResponse) {
        try {
            const {body, params} = request;
            AuthValidation.resetPasswordValidation({...body, ...params});
            const resetPasswordDTO = ResetPasswordDTO.create({...body, ...params});
            const httpResponse = await authService.resetPassword(resetPasswordDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async logout(request: TRequest, response: TResponse) {
        try {
            const {admin} = request;
            const httpResponse = await authService.logout(admin as AdminEntity);
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

    static async getAdmin(request: TRequest, response: TResponse) {
        try {
            const httpResponse = await authService.getAdmin(request);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}

export default AuthController;
