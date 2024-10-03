import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {CartRequestForm} from "@infrastructure/Database/Models/CartRequestForm";

import type {CartRequestFormEntity} from "@entities/CartRequestForm/CartRequestFormEntity";
import type {ICartRequestFormRepository} from "@entities/CartRequestForm/ICartRequestFormRepository";

@injectable()
export class CartRequestFormRepository
    extends BaseRepository<CartRequestForm, CartRequestFormEntity>
    implements ICartRequestFormRepository
{
    constructor() {
        super(CartRequestForm);
    }
}
