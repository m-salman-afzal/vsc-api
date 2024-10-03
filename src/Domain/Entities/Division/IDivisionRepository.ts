import type DivisionEntity from "@entities/Division/DivisionEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {Division} from "@infrastructure/Database/Models/Division";

export default interface IDivisionRepository extends IBaseRepository<Division, DivisionEntity> {}
