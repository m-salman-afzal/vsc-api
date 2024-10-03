import {injectable} from "tsyringe";

import BaseRepository from "@repositories/BaseRepository";

import {Facility} from "@infrastructure/Database/Models/Facility";

import {FacilityQueryBuilder} from "./Shared/Query/FacilityQueryBuilder";
import {SEARCH_FACILITY_REPOSITORY_FIELDS} from "./Shared/Query/FieldsBuilder";

import type {FacilityEntity} from "@entities/Facility/FacilityEntity";
import type {IFacilityRepository} from "@entities/Facility/IFacilityRepository";
import type {TSearchFilters} from "@typings/ORM";

@injectable()
export class FacilityRepository extends BaseRepository<Facility, FacilityEntity> implements IFacilityRepository {
    constructor() {
        super(Facility);
    }

    async fetchBySearchQuery(searchFilters: TSearchFilters<Facility>) {
        const query = this.model.createQueryBuilder("facility").where("1=1").orderBy("facility.facilityName", "ASC");

        const queryFilters = FacilityQueryBuilder.setFilter(query, searchFilters);

        const facility = await queryFilters.select(SEARCH_FACILITY_REPOSITORY_FIELDS).getRawMany();

        if (facility.length === 0) {
            return false;
        }

        return facility;
    }
}
