import type {FacilityEntity} from "@entities/Facility/FacilityEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {Facility} from "@infrastructure/Database/Models/Facility";
import type {TSearchFilters} from "@typings/ORM";

export interface IFacilityRepository extends IBaseRepository<Facility, FacilityEntity> {
    fetchBySearchQuery(searchFilters: TSearchFilters<Facility>): Promise<false | Facility[]>;
}
