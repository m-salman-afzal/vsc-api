import {Between} from "typeorm";

import SharedUtils from "@appUtils/SharedUtils";

import type DivisionEntity from "@entities/Division/DivisionEntity";
import type {Division} from "@infrastructure/Database/Models/Division";
import type {TWhereFilter} from "@typings/ORM";

type TFilterDivision = Partial<DivisionEntity> & {dateFrom: string; dateTo: string};

type TWhereDivision = TWhereFilter<Division>;

export class DivisionReportFilter {
    private where: TWhereDivision;
    constructor(filters: TFilterDivision) {
        this.where = {};
        this.setFacilityId(filters);
        this.setDivisionType(filters);
        this.setDateRange(filters);
    }

    static setFilter(filters: TFilterDivision) {
        return new DivisionReportFilter(filters).where;
    }

    setFacilityId(filters: TFilterDivision) {
        if (filters.facilityId) {
            this.where.facilityId = filters.facilityId;
        }
    }

    setDivisionType(filters: TFilterDivision) {
        if (filters.divisionType) {
            this.where.divisionType = filters.divisionType;
        }
    }

    setDateRange(filters: TFilterDivision) {
        if (filters.dateFrom && filters.dateTo) {
            this.where.year = Between(
                SharedUtils.getYearFromDate(filters.dateFrom),
                SharedUtils.getYearFromDate(filters.dateTo)
            );
        }
    }
}
