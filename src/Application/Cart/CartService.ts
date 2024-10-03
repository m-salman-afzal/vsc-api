import async from "async";
import {inject, injectable} from "tsyringe";

import {CartEntity} from "@entities/Cart/CartEntity";
import {FacilityUnitEntity} from "@entities/FacilityUnit/FacilityUnitEntity";
import {ReferenceGuideEntity} from "@entities/ReferenceGuide/ReferenceGuideEntity";

import {ORDER_BY} from "@appUtils/Constants";
import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {CartFilter} from "@repositories/Shared/ORM/CartFilter";
import {FacilityUnitFilter} from "@repositories/Shared/ORM/FacilityUnitsFilter";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {facilityUnitsService} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddCartDto} from "./Dtos/AddCartDto";
import type {DeleteCartDto} from "./Dtos/DeletCartDto";
import type {GetCartDto} from "./Dtos/GetCartDto";
import type {UpdateCartDto} from "./Dtos/UpdateCartDto";
import type {ICartRepository} from "@entities/Cart/ICartRepository";
import type {Cart} from "@infrastructure/Database/Models/Cart";
import type {PaginationDto} from "@infraUtils/PaginationDto";
import type {TFilterCart} from "@repositories/Shared/Query/CartQueryBuilder";

@injectable()
export class CartService extends BaseService<Cart, CartEntity> {
    constructor(@inject("ICartRepository") private cartRepository: ICartRepository) {
        super(cartRepository);
    }

    async fetchPaginatedBySearchQuery(searchFilters: TFilterCart, pagination: PaginationOptions) {
        return this.cartRepository.fetchPaginatedBySearchQuery(searchFilters, pagination);
    }

    async fetchAllBySearchQuery(searchFilters: TFilterCart) {
        return this.cartRepository.fetchAllBySearchQuery(searchFilters);
    }

    async getPaginatedCarts(getCartDto: GetCartDto, paginationDto: PaginationDto) {
        try {
            const pagination = PaginationOptions.create(paginationDto);
            const searchFilter: TFilterCart = {
                cart: getCartDto.cart,
                unit: getCartDto.cart,
                facilityId: getCartDto.facilityId,
                assignedCartsOnly: true
            };
            const isCart = await this.fetchPaginatedBySearchQuery(searchFilter, pagination);

            if (!isCart) {
                return HttpResponse.notFound();
            }

            const CartWithUnitCounts: unknown[] = [];
            await async.eachSeries(isCart.rows, async (cart) => {
                const {facilityUnit, referenceGuide} = cart;
                const cartEntity = CartEntity.create(cart);
                if (facilityUnit) {
                    const totalQuantity = facilityUnit.reduce(
                        (initialValue, currentValue) => initialValue + currentValue.quantity,
                        0
                    );
                    const totalDrugCount = facilityUnit.reduce(
                        (initialValue, currentValue) => initialValue + currentValue.drugCount,
                        0
                    );
                    const totalPatientCount = facilityUnit.reduce(
                        (initialValue, currentValue) => initialValue + currentValue.patientCount,
                        0
                    );
                    const unitsList = facilityUnit.map((unit) => ({
                        unit: unit.unit,
                        facilityUnitId: unit.facilityUnitId
                    }));

                    CartWithUnitCounts.push({
                        ...cartEntity,
                        referenceGuide: referenceGuide
                            ? {
                                  ...ReferenceGuideEntity.create(referenceGuide),
                                  isDeleted: !!referenceGuide.deletedAt
                              }
                            : null,
                        drugCount: totalDrugCount,
                        quantity: totalQuantity,
                        patientCount: totalPatientCount,
                        units: unitsList
                    });
                }
            });

            if (CartWithUnitCounts.length === 0) {
                return HttpResponse.notFound();
            }

            const paginatedCarts = PaginationData.getPaginatedData(pagination, isCart.count, CartWithUnitCounts);

            return HttpResponse.ok(paginatedCarts);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getCarts(getCartDto: GetCartDto) {
        try {
            const searchFilter: TFilterCart = {
                cart: getCartDto.cart,
                unit: getCartDto.cart,
                facilityId: getCartDto.facilityId,
                assignedCartsOnly: true
            };
            const isCarts = await this.fetchAllBySearchQuery(searchFilter);

            if (!isCarts) {
                return HttpResponse.notFound();
            }
            const cartEntities: CartEntity[] = [];
            await async.eachSeries(isCarts, async (cart) => {
                const cartEntity = CartEntity.create(cart);

                cartEntities.push(cartEntity);
            });

            return HttpResponse.ok(cartEntities);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async addCart(addCartDto: AddCartDto) {
        try {
            const {units, cart} = addCartDto;
            const isCartExist = await this.fetch({cart});
            if (isCartExist) {
                return HttpResponse.conflict({message: "Cart already exists"});
            }
            const cartEntity = CartEntity.create(addCartDto);
            cartEntity.cartId = SharedUtils.shortUuid();

            await this.create(cartEntity);

            await async.eachSeries(units, async (unit) => {
                const filters = FacilityUnitFilter.setFilter({facilityUnitId: unit});
                const isUnit = await facilityUnitsService.fetch({facilityUnitId: unit});
                const unitEntity = FacilityUnitEntity.create(isUnit);
                unitEntity.cartId = cartEntity.cartId;
                await facilityUnitsService.update(filters, unitEntity);
            });

            return HttpResponse.ok(cartEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async updateCart(updateCartDto: UpdateCartDto) {
        try {
            const {units} = updateCartDto;
            const cartEntity = CartEntity.create(updateCartDto);
            const unitFilter = FacilityUnitFilter.setFilter({cartId: cartEntity.cartId});
            const currentUnitsOfCart = await facilityUnitsService.fetchAll(unitFilter, {});
            if (!currentUnitsOfCart) {
                return HttpResponse.notFound();
            }

            const unitsToRemove = currentUnitsOfCart.filter(
                (currentUnit) => !units.find((unit) => unit === currentUnit.facilityUnitId)
            );

            const unitsToAdd = units.filter(
                (unit) => !currentUnitsOfCart.find((currentUnit) => unit === currentUnit.facilityUnitId)
            );

            await async.eachSeries(unitsToAdd, async (unit) => {
                const unitIdFilter = FacilityUnitFilter.setFilter({facilityUnitId: unit});
                const isUnit = await facilityUnitsService.fetch(unitIdFilter);
                const unitEntity = FacilityUnitEntity.create(isUnit);
                unitEntity.cartId = cartEntity.cartId;
                await facilityUnitsService.update(unitIdFilter, unitEntity);
            });

            await async.eachSeries(unitsToRemove, async (unit) => {
                const unitIdFilter = FacilityUnitFilter.setFilter({facilityUnitId: unit.facilityUnitId});
                const isUnit = {...unit, cartId: null};
                const unitEntity = FacilityUnitEntity.create(isUnit);
                await facilityUnitsService.update(unitIdFilter, unitEntity);
            });

            await this.update({cartId: cartEntity.cartId}, cartEntity);

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async deleteCart(deleteCartDto: DeleteCartDto) {
        try {
            const unitFilter = FacilityUnitFilter.setFilter({cartId: deleteCartDto.cartId});
            const currentUnitsOfCart = await facilityUnitsService.fetchAll(unitFilter, {});
            const isCart = await this.fetch({cartId: deleteCartDto.cartId});
            if (!isCart) {
                return HttpResponse.notFound();
            }

            if (!currentUnitsOfCart) {
                return HttpResponse.notFound();
            }

            await async.eachSeries(currentUnitsOfCart, async (currentUnit) => {
                const newUnit = {...currentUnit, cartId: null};
                const unitIdFilter = FacilityUnitFilter.setFilter({facilityUnitId: currentUnit.facilityUnitId});
                const unitEntity = FacilityUnitEntity.create(newUnit);
                await facilityUnitsService.update(unitIdFilter, unitEntity);
            });

            await this.remove({cartId: deleteCartDto.cartId});

            return HttpResponse.noContent();
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getAllCarts(getCartDto: GetCartDto, paginationDto: PaginationDto) {
        try {
            const pagination = PaginationOptions.create(paginationDto);
            const carts = await this.fetchPaginatedBySearchQuery(getCartDto, pagination);
            if (!carts) {
                return HttpResponse.notFound();
            }

            const {rows, count} = carts;

            const cartIds = rows.map((cart) => ({
                cartId: cart.cartId,
                cart: cart.cart,
                referenceGuide: !cart.referenceGuide?.deletedAt
                    ? ReferenceGuideEntity.create(cart.referenceGuide)
                    : null
            }));
            const paginatedEntity = PaginationData.getPaginatedData(pagination, count, cartIds);

            return HttpResponse.ok(paginatedEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getCartNames(getCartDto: GetCartDto) {
        try {
            const searchFilter = CartFilter.setFilter(getCartDto);
            const carts = await this.fetchAll(searchFilter, {cart: ORDER_BY.ASC});
            if (!carts) {
                return HttpResponse.notFound();
            }
            const cartNames = carts.map((cart) => cart.cart);

            return HttpResponse.ok(cartNames);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
