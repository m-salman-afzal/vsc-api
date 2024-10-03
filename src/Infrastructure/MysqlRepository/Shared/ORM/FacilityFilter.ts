import {In, Like} from "typeorm";

import type {IFacilityEntity} from "@entities/Facility/FacilityEntity";
import type {Facility} from "@infrastructure/Database/Models/Facility";
import type {ReplaceKeys} from "@typings/Misc";
import type {TWhereFilter} from "@typings/ORM";

type TFilterFacility = ReplaceKeys<
    Partial<IFacilityEntity>,
    "facilityId" | "externalFacilityId",
    {facilityId: string | string[]; externalFacilityId: string | string[]}
>;

type TWhereFacility = TWhereFilter<Facility>;

export class FacilityFilter {
    private where: TWhereFacility;
    constructor(filters: TFilterFacility) {
        this.where = {};
        this.setId(filters);
        this.setFacilityId(filters);
        this.setFacilityName(filters);
        this.setExternalFacilityId(filters);
    }

    static setFilter(filters: TFilterFacility) {
        return new FacilityFilter(filters).where;
    }

    setId(filters: TFilterFacility) {
        if (filters.id) {
            this.where.id = filters.id;
        }
    }

    setFacilityId(filters: TFilterFacility) {
        if (Array.isArray(filters.facilityId)) {
            this.where.facilityId = In(filters.facilityId);

            return;
        }

        if (filters.facilityId) {
            this.where.facilityId = filters.facilityId;
        }
    }

    setFacilityName(filters: TFilterFacility) {
        if (filters.facilityName) {
            this.where.facilityName = Like(`%${filters.facilityName}%`);
        }
    }

    setExternalFacilityId(filters: TFilterFacility) {
        if (Array.isArray(filters.externalFacilityId)) {
            this.where.externalFacilityId = In(filters.externalFacilityId);

            return;
        }

        if (filters.externalFacilityId) {
            this.where.externalFacilityId = filters.externalFacilityId;
        }
    }
}
