import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {FacilityAdmin} from "@infrastructure/Database/Models/FacilityAdmin";

import type {FacilityAdminEntity} from "@entities/FacilityAdmin/FacilityAdminEntity";
import type {IFacilityAdminRepository, TFacilityCount} from "@entities/FacilityAdmin/IFacilityAdminRepository";

@injectable()
export class FacilityAdminRepository
    extends BaseRepository<FacilityAdmin, FacilityAdminEntity>
    implements IFacilityAdminRepository
{
    constructor() {
        super(FacilityAdmin);
    }
    async fetchFacilityCounts(): Promise<TFacilityCount[]> {
        return await this.model
            .createQueryBuilder("facilityAdmin")
            .select("facility.facilityId", "facilityId")
            .addSelect("COUNT(DISTINCT facilityAdmin.id)", "staffCount")
            .leftJoin(
                "Facilities",
                "facility",
                "facility.facilityId = facilityAdmin.facilityId AND facility.deletedAt IS NULL"
            )
            .where("facilityAdmin.deletedAt IS NULL")
            .groupBy("facility.facilityId")
            .getRawMany();
    }
}
