import CartValidation from "@validations/CartValidation";

import HttpResponse from "@appUtils/HttpResponse";

import {AddCartDto} from "@application/Cart/Dtos/AddCartDto";
import {DeleteCartDto} from "@application/Cart/Dtos/DeletCartDto";
import {GetCartDto} from "@application/Cart/Dtos/GetCartDto";
import {UpdateCartDto} from "@application/Cart/Dtos/UpdateCartDto";

import {PaginationDto} from "@infraUtils/PaginationDto";

import {cartService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {TRequest, TResponse} from "@typings/Express";

export class CartController {
    static async addCart(request: TRequest, response: TResponse) {
        try {
            const {body} = request;
            CartValidation.addCartValidation(body);
            const addCartDto = AddCartDto.create(body);

            const httpResponse = await cartService.addCart(addCartDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getPaginatedCarts(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            CartValidation.getPaginatedCartValidation(query);
            const getCartDTO = GetCartDto.create(query);
            const paginationDto = PaginationDto.create(query);
            const httpResponse = await cartService.getPaginatedCarts(getCartDTO, paginationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getCarts(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            CartValidation.getPaginatedCartValidation(query);
            const getCartDTO = GetCartDto.create(query);
            const httpResponse = await cartService.getCarts(getCartDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async updateCart(request: TRequest, response: TResponse) {
        try {
            const {body, params} = request;
            CartValidation.updateCartValidation({...body, ...params});
            const updateCartDto = UpdateCartDto.create({...body, ...params});
            const httpResponse = await cartService.updateCart(updateCartDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async removeCart(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            CartValidation.updateCartValidation({...query});
            const deletCartDto = DeleteCartDto.create(query);
            const httpResponse = await cartService.deleteCart(deletCartDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getAllCarts(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            CartValidation.getCartValidation(query);
            const dto = GetCartDto.create(query);
            const paginationDto = PaginationDto.create(query);
            const httpResponse = await cartService.getAllCarts(dto, paginationDto);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }

    static async getCartNames(request: TRequest, response: TResponse) {
        try {
            const {query} = request;
            CartValidation.getCartNamesValidation(query);
            const getCartDTO = GetCartDto.create(query);
            const httpResponse = await cartService.getCartNames(getCartDTO);

            return HttpResponse.convertToExpress(response, httpResponse);
        } catch (error) {
            return HttpResponse.convertToExpress(response, HttpResponse.error({message: ErrorLog(error)}));
        }
    }
}
