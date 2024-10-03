import type DivisionSwornEntity from "@entities/DivisionSworn/DivisionSwornEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {DivisionSworn} from "@infrastructure/Database/Models/DivisionSworn";

export default interface IDivisionSwornRepository extends IBaseRepository<DivisionSworn, DivisionSwornEntity> {}
