import type {FacilityAdminEntity} from "@entities/FacilityAdmin/FacilityAdminEntity";
import type IBaseRepository from "@entities/IBaseRepository";
import type {FacilityAdmin} from "@infrastructure/Database/Models/FacilityAdmin";

export type TFacilityCount = {facilityId: string; staffCount: number};
export interface IFacilityAdminRepository extends IBaseRepository<FacilityAdmin, FacilityAdminEntity> {
    fetchFacilityCounts(): Promise<TFacilityCount[]>;
}
