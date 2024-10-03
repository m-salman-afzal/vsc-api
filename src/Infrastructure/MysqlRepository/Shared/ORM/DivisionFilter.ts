import {In, IsNull, Not} from "typeorm";

import type DivisionEntity from "@entities/Division/DivisionEntity";
import type {Division} from "@infrastructure/Database/Models/Division";
import type {TWhereFilter} from "@typings/ORM";

type TFilterDivision = Partial<DivisionEntity> & {setPosition?: boolean; years?: number[]};

type TWhereDivision = TWhereFilter<Division>;

export class DivisionFilter {
    private where: TWhereDivision;
    constructor(filters: TFilterDivision) {
        this.where = {};
        this.setDivisionId(filters);
        this.setTitle(filters);
        this.setWatch(filters);
        this.setDivisionType(filters);
        this.setYear(filters);
        this.setFacilityId(filters);
        this.setPosition(filters);
    }

    static setFilter(filters: TFilterDivision) {
        return new DivisionFilter(filters).where;
    }

    setDivisionId(filters: TFilterDivision) {
        if (filters.divisionId) {
            this.where.divisionId = filters.divisionId;
        }
    }

    setTitle(filters: TFilterDivision) {
        if (filters.title) {
            this.where.title = filters.title;
        }
    }

    setWatch(filters: TFilterDivision) {
        if (filters.watch) {
            this.where.watch = filters.watch;
        }
    }

    setDivisionType(filters: TFilterDivision) {
        if (filters.divisionType) {
            this.where.divisionType = filters.divisionType;
        }
    }

    setYear(filters: TFilterDivision) {
        if (filters.year) {
            this.where.year = filters.year;
        }
        if (filters.years) {
            this.where.year = In(filters.years);
        }
    }

    setFacilityId(filters: TFilterDivision) {
        if (filters.facilityId) {
            this.where.facilityId = filters.facilityId;
        }
    }

    setPosition(filters: TFilterDivision) {
        if (filters.setPosition) {
            this.where.position = Not(IsNull());

            return;
        }
        this.where.position = IsNull();
    }
}
