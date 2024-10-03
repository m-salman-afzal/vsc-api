import type {CartRequestFormEntity} from "@entities/CartRequestForm/CartRequestFormEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {CartRequestForm} from "@infrastructure/Database/Models/CartRequestForm";

export interface ICartRequestFormRepository extends IBaseRepository<CartRequestForm, CartRequestFormEntity> {}
