import {In, IsNull, Not} from "typeorm";

import type DivisionSwornEntity from "@entities/DivisionSworn/DivisionSwornEntity";
import type {DivisionSworn} from "@infrastructure/Database/Models/DivisionSworn";
import type {TWhereFilter} from "@typings/ORM";

type TFilterDivisionSworn = Partial<DivisionSwornEntity> & {setPosition?: boolean; years?: number[]};

type TWhereDivisionSworn = TWhereFilter<DivisionSworn>;

export class DivisionSwornFilter {
    private where: TWhereDivisionSworn;
    constructor(filters: TFilterDivisionSworn) {
        this.where = {};
        this.setDivisionSwornId(filters);
        this.setTitle(filters);
        this.setYear(filters);
        this.setCategory(filters);
        this.setFacilityId(filters);
        this.setPosition(filters);
    }

    static setFilter(filters: TFilterDivisionSworn) {
        return new DivisionSwornFilter(filters).where;
    }

    setDivisionSwornId(filters: TFilterDivisionSworn) {
        if (filters.divisionSwornId) {
            this.where.divisionSwornId = filters.divisionSwornId;
        }
    }

    setTitle(filters: TFilterDivisionSworn) {
        if (filters.title) {
            this.where.title = filters.title;
        }
    }

    setYear(filters: TFilterDivisionSworn) {
        if (filters.year) {
            this.where.year = filters.year;
        }
        if (filters.years) {
            this.where.year = In(filters.years);
        }
    }

    setCategory(filters: TFilterDivisionSworn) {
        if (filters.category) {
            this.where.category = filters.category;
        }
    }

    setFacilityId(filters: TFilterDivisionSworn) {
        if (filters.facilityId) {
            this.where.facilityId = filters.facilityId;
        }
    }

    setPosition(filters: TFilterDivisionSworn) {
        if (filters.setPosition) {
            this.where.position = Not(IsNull());

            return;
        }
        this.where.position = IsNull();
    }
}
