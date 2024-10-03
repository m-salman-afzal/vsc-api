import {Brackets} from "typeorm";

import type {IFacilityEntity} from "@entities/Facility/FacilityEntity";
import type {Facility} from "@infrastructure/Database/Models/Facility";
import type {TQueryBuilder} from "@typings/ORM";

type TFilterFacility = Partial<IFacilityEntity> & {
    toDate?: string | undefined;
    fromDate?: string | undefined;
    text?: string | undefined;
};
type TQueryBuilderFacility = TQueryBuilder<Facility>;

export class FacilityQueryBuilder {
    private query: TQueryBuilderFacility;
    constructor(query: TQueryBuilderFacility, filters: TFilterFacility) {
        this.query = query;

        this.setId(filters);
        this.setFacilityId(filters);
        this.setMultiple(filters);
    }

    static setFilter(query: TQueryBuilderFacility, filters) {
        return new FacilityQueryBuilder(query, filters).query;
    }

    setId(filters: TFilterFacility) {
        if (!Number.isNaN(Number(filters.id))) {
            this.query.andWhere("facility.id = :id", {id: filters.id});
        }
    }

    setFacilityId(filters: TFilterFacility) {
        if (filters.facilityId) {
            this.query.andWhere("facility.facilityId = :facilityId", {facilityId: filters.facilityId});
        }
    }

    setMultiple(filters: TFilterFacility) {
        if (Number.isNaN(Number(filters.id)) && (filters.externalFacilityId || filters.facilityName)) {
            this.query.andWhere(
                new Brackets((qb) => {
                    qb.orWhere("facility.externalFacilityId LIKE :externalFacilityId", {
                        externalFacilityId: `%${filters.externalFacilityId}%`
                    });
                    qb.orWhere("facility.facilityName LIKE :facilityName", {
                        facilityName: `%${filters.facilityName}%`
                    });
                })
            );
        }
    }
}
